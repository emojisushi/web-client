import {
  IPosterPromotion,
  IPosterPromotionGift,
} from "@layerok/emojisushi-js-sdk";
import { CartItem } from "~domains/cart/cart.query";
import { isWindowOpen } from "~domains/promotions/promotion-window";

export type CartGift = {
  promotion: IPosterPromotion;
  gift: IPosterPromotionGift;
  quantity: number;
};

export type CartGiftHint = {
  promotion: IPosterPromotion;
  // how many more qualifying items are needed for the gift
  missing: number;
};

const qualifyingCount = (items: CartItem[], promotion: IPosterPromotion) =>
  items.reduce((acc, item) => {
    const inCategory = (item.product.categories || []).some((category) =>
      promotion.category_ids.includes(category.id)
    );
    return inCategory ? acc + item.quantity : acc;
  }, 0);

type GiftOptions = {
  // our spot, when known
  spotId?: number;
  // "HH:MM" Kyiv time, from useKyivTime() so every component agrees
  time?: string;
};

// at the spot, when it is known, and inside the promotion's time window
const availableAt = (
  promotion: IPosterPromotion,
  { spotId, time }: GiftOptions
) =>
  (spotId === undefined || promotion.spot_ids.includes(spotId)) &&
  isWindowOpen(promotion.active_from, promotion.active_to, time);

/**
 * The gifts the cart qualifies for. Mirrors the backend rule for display only —
 * the order is checked again on placement and that decides the gift.
 */
export const getCartGifts = (
  items: CartItem[] = [],
  promotions: IPosterPromotion[] = [],
  options: GiftOptions = {}
): CartGift[] =>
  promotions
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
  options: GiftOptions = {}
): CartGiftHint[] =>
  promotions
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
