import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cartQuery,
  removeProductFromCartMutation,
} from "~domains/cart/cart.query";

export const useRemoveProductFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...removeProductFromCartMutation,
    onSuccess: () => {
      queryClient.invalidateQueries(cartQuery);
    },
    onError: () => {
      // todo: show error to user
    },
  });
};
