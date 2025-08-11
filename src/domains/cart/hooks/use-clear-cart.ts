import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartQuery, clearCartMutation } from "~domains/cart/cart.query";

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...clearCartMutation,
    onSuccess: () => {
      queryClient.invalidateQueries(cartQuery);
    },
    onError: () => {
      // todo: show error to user
    },
  });
};
