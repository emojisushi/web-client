import { MutationOptions, QueryOptions } from "@tanstack/react-query";
import { arrImmutableReplaceAt } from "~utils/arr.utils";

export const CART_STORAGE_KEY = "cart";

export type CartItem = {
  product_id: number;
  variant_id?: number;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
};

export const EMPTY_CART: Cart = {
  items: [],
};

export const addProductToCartMutation: MutationOptions<Cart, any, CartItem> = {
  mutationFn: async (variables: CartItem) => {
    const cartItem = variables;
    const rawCart = localStorage.getItem(CART_STORAGE_KEY);

    const cart = rawCart ? (JSON.parse(rawCart) as Cart) : EMPTY_CART;

    const index = cart.items.findIndex(
      (item) =>
        item.product_id === cartItem.product_id &&
        item.variant_id === cartItem.variant_id
    );

    const nextItems =
      index !== -1
        ? arrImmutableReplaceAt(cart.items, index, cartItem)
        : [...cart.items, cartItem];

    const nextCart = {
      items: nextItems,
    };

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart));

    return nextCart;
  },
};

export const removeProductFromCartMutation: MutationOptions<
  Cart,
  any,
  {
    product_id: number;
    variant_id?: number;
  }
> = {
  mutationFn: async (variables: CartItem) => {
    const cartItem = variables;
    const rawCart = localStorage.getItem(CART_STORAGE_KEY);

    const cart = rawCart ? (JSON.parse(rawCart) as Cart) : EMPTY_CART;

    const nextItems = cart.items.filter(
      (item) =>
        !(
          item.product_id === cartItem.product_id &&
          item.variant_id === cartItem.variant_id
        )
    );

    const nextCart = {
      items: nextItems,
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
