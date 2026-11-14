import {
  IPosterDiscountPromotion,
  IPosterGiftPromotion,
  IPosterPromotion,
  IPosterPromotionGift,
} from "@layerok/emojisushi-js-sdk";
import { CartItem } from "~domains/cart/cart.query";
import { isWindowOpen } from "~domains/promotions/promotion-window";
import { getNewProductPrice } from "~domains/product/product.utils";

export type CartGift = {
  promotion: IPosterGiftPromotion;
  gift: IPosterPromotionGift;
  quantity: number;
};

export type CartGiftHint = {
  promotion: IPosterGiftPromotion;
  // how many more qualifying items are needed for the gift
  missing: number;
};

export type CartDiscount = {
  promotion: IPosterDiscountPromotion;
  percent: number;
  // in kopecks
  amount: number;
};

export type OrderType = "takeaway" | "courier";

const qualifyingCount = (items: CartItem[], promotion: IPosterGiftPromotion) =>
  items.reduce(
    (acc, item) =>
      promotion.product_ids.includes(item.product.id)
        ? acc + item.quantity
        : acc,
    0
  );

type PromotionOptions = {
  // our spot, when known
  spotId?: number;
  // "N HH:MM" Kyiv week day and time, from useKyivTime() so every component agrees
  time?: string;
  // the order's type, when known; without it only promotions for all orders apply
  orderType?: OrderType;
};

// at the spot, for this kind of order, on one of its days, inside its time window
const availableAt = (
  promotion: IPosterPromotion,
  { spotId, time, orderType }: PromotionOptions
) =>
  (spotId === undefined || promotion.spot_ids.includes(spotId)) &&
  (promotion.order_types === "all" || promotion.order_types === orderType) &&
  isWindowOpen(
    promotion.active_from,
    promotion.active_to,
    promotion.active_days,
    time
  );

const giftPromotions = (promotions: IPosterPromotion[] = []) =>
  promotions.filter(
    (promotion): promotion is IPosterGiftPromotion => promotion.kind === "gift"
  );

/**
 * The gifts the cart qualifies for. Promotions do not combine and a gift comes
 * first, so a gift always stays. Mirrors the backend rule for display only —
 * the order is checked again on placement and that decides the gift.
 */
export const getCartGifts = (
  items: CartItem[] = [],
  promotions: IPosterPromotion[] = [],
  options: PromotionOptions = {}
): CartGift[] => qualifyingGifts(items, promotions, options);

/**
 * A discount the cart would get but loses to a gift, e.g. 10% off a takeaway
 * order that gets the 2+1 pizza instead. Null when there is no such clash.
 */
export const getPromotionConflict = (
  items: CartItem[] = [],
  promotions: IPosterPromotion[] = [],
  options: PromotionOptions = {}
): { gifts: CartGift[]; discount: CartDiscount } | null => {
  const discount = qualifyingDiscount(items, promotions, options);
  const gifts = qualifyingGifts(items, promotions, options);
  return discount && gifts.length > 0 ? { gifts, discount } : null;
};

const qualifyingGifts = (
  items: CartItem[] = [],
  promotions: IPosterPromotion[] = [],
  options: PromotionOptions = {}
): CartGift[] =>
  giftPromotions(promotions)
    .filter((promotion) => availableAt(promotion, options))
    .map((promotion) => {
      const count = qualifyingCount(items, promotion);
      if (count < promotion.required_count) {
        return null;
      }
      const quantity = promotion.accumulate
        ? Math.floor(count / promotion.required_count) * promotion.gift_count
        : promotion.gift_count;
      return { promotion, gift: promotion.gift, quantity };
    })
    .filter((gift): gift is CartGift => !!gift && gift.quantity > 0);

/**
 * Promotions the cart has started on but not reached yet, e.g. one pizza of two.
 */
export const getCartGiftHints = (
  items: CartItem[] = [],
  promotions: IPosterPromotion[] = [],
  options: PromotionOptions = {}
): CartGiftHint[] =>
  giftPromotions(promotions)
    .filter((promotion) => availableAt(promotion, options))
    .map((promotion) => ({
      promotion,
      count: qualifyingCount(items, promotion),
    }))
    .filter(
      ({ promotion, count }) => count > 0 && count < promotion.required_count
    )
    .map(({ promotion, count }) => ({
      promotion,
      missing: promotion.required_count - count,
    }));

/**
 * The discount promotion for this order, if any: none when the order gets a gift,
 * since promotions do not combine and the gift comes first. Products «без скидок»
 * in Poster are left out, as on its bill. Display only — the backend works it out
 * again and that is what Poster gets.
 */
export const getCartDiscount = (
  items: CartItem[] = [],
  promotions: IPosterPromotion[] = [],
  options: PromotionOptions = {}
): CartDiscount | null =>
  qualifyingGifts(items, promotions, options).length > 0
    ? null
    : qualifyingDiscount(items, promotions, options);

/**
 * The discount promotion running now for this kind of order, whatever is in the
 * cart — to advertise it, e.g. "−10%" on the takeaway tab. What the order really
 * gets is getCartDiscount (the cart may be under min_sum or get a gift instead).
 */
export const getAvailableDiscount = (
  promotions: IPosterPromotion[] = [],
  options: PromotionOptions = {}
): IPosterDiscountPromotion | null =>
  promotions.find(
    (promotion): promotion is IPosterDiscountPromotion =>
      promotion.kind === "discount" && availableAt(promotion, options)
  ) ?? null;

// the discount the order qualifies for, before gifts take precedence
// (the backend allows only one discount per order type)
const qualifyingDiscount = (
  items: CartItem[] = [],
  promotions: IPosterPromotion[] = [],
  options: PromotionOptions = {}
): CartDiscount | null => {
  for (const promotion of promotions) {
    if (promotion.kind !== "discount" || !availableAt(promotion, options)) {
      continue;
    }
    const lineSum = (item: CartItem) =>
      (getNewProductPrice(item.product, item.variant)?.price ?? 0) *
      item.quantity;
    // Poster's "order sum from" condition, on the whole order
    const orderSum = items.reduce((sum, item) => sum + lineSum(item), 0);
    if (orderSum < (promotion.min_sum ?? 0)) {
      continue;
    }
    const discountable = items
      .filter(
        (item) => !promotion.nodiscount_product_ids.includes(item.product.id)
      )
      .reduce((sum, item) => sum + lineSum(item), 0);
    const amount = Math.round((discountable * promotion.percent) / 100);
    if (amount > 0) {
      return { promotion, percent: promotion.percent, amount };
    }
  }
  return null;
};
