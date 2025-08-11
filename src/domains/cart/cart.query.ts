import { MutationOptions, QueryOptions } from "@tanstack/react-query";
import { arrImmutableReplaceAt } from "~utils/arr.utils";
import { IProduct, IVariant } from "@layerok/emojisushi-js-sdk";
import { getNewProductPrice } from "~domains/product/product.utils";

export const CART_STORAGE_KEY = "cart_v2";

const generateId = () => {
  return Math.round(Math.random() * 100000000);
};

type CartItemId = string;

// todo: maybe add id property
export type CartItem = {
  id: CartItemId;
  product: IProduct;
  variant?: IVariant;
  quantity: number;
};

type CartItemWithoutId = Omit<CartItem, "id">;

export type Cart = {
  items: CartItem[];
  total: string;
  totalQuantity: number;
};

const formatPrice = (x: number) => {
  return x + " грн.";
};

export const EMPTY_CART: Cart = {
  items: [],
  total: formatPrice(0),
  totalQuantity: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((acc, item) => {
    const { product, variant } = item;
    return (
      acc + item.quantity * (getNewProductPrice(product, variant).price / 100)
    );
  }, 0);

  const totalQuantity = items.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

  return {
    total: formatPrice(total),
    totalQuantity: totalQuantity,
  };
};

export const addProductToCartMutation: MutationOptions<
  Cart,
  any,
  CartItemWithoutId
> = {
  mutationFn: async (cartItemWithoutId) => {
    const rawCart = localStorage.getItem(CART_STORAGE_KEY);

    const cart = rawCart ? (JSON.parse(rawCart) as Cart) : EMPTY_CART;

    const index = cart.items.findIndex(
      (item) =>
        item.product.id === cartItemWithoutId.product.id &&
        item.variant?.id === cartItemWithoutId.variant?.id
    );

    const cartItem: CartItem = {
      id: generateId() + "",
      ...cartItemWithoutId,
    };

    const nextItems =
      index !== -1
        ? arrImmutableReplaceAt(cart.items, index, cartItem)
        : [...cart.items, cartItem];

    const nextCart = {
      items: nextItems,
      ...calculateTotals(nextItems),
    };

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart));

    return nextCart;
  },
};

export const removeItemFromCartMutation: MutationOptions<
  Cart,
  any,
  {
    id: CartItemId;
  }
> = {
  mutationFn: async (variables) => {
    const { id } = variables;
    const rawCart = localStorage.getItem(CART_STORAGE_KEY);

    const cart = rawCart ? (JSON.parse(rawCart) as Cart) : EMPTY_CART;

    const nextItems = cart.items.filter((item) => !(item.id === id));

    const nextCart = {
      items: nextItems,
      ...calculateTotals(nextItems),
    };

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart));

    return nextCart;
  },
};

export const clearCartMutation: MutationOptions = {
  mutationFn: async () => {
    localStorage.removeItem(CART_STORAGE_KEY);

    return EMPTY_CART;
  },
};

export const removeManyItemsFromCartMutation: MutationOptions<
  Cart,
  any,
  {
    ids: CartItemId[];
  }
> = {
  mutationFn: async (variables) => {
    const { ids } = variables;
    const rawCart = localStorage.getItem(CART_STORAGE_KEY);

    const cart = rawCart ? (JSON.parse(rawCart) as Cart) : EMPTY_CART;

    const nextItems = cart.items.filter((item) => !ids.includes(item.id));

    const nextCart = {
      items: nextItems,
      ...calculateTotals(nextItems),
    };

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart));

    return nextCart;
  },
};

export const cartQuery: QueryOptions<Cart> = {
  queryKey: ["cart"],
  queryFn: () => {
    const cart = localStorage.getItem(CART_STORAGE_KEY);

    if (cart) {
      return JSON.parse(cart);
    }

    return EMPTY_CART;
  },
};
