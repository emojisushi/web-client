import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cartQuery,
  removeItemFromCartMutation,
} from "~domains/cart/cart.query";

export const useRemoveItemFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...removeItemFromCartMutation,
    onSuccess: () => {
      queryClient.invalidateQueries(cartQuery);
    },
    onError: () => {
      // todo: show error to user
    },
  });
};
