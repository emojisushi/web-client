import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProductToCartMutation, cartQuery } from "~domains/cart/cart.query";

export const useAddProductToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...addProductToCartMutation,
    onSuccess: () => {
      queryClient.invalidateQueries(cartQuery);
    },
    onError: (e) => {
      // todo: show error to user
    },
  });
};
