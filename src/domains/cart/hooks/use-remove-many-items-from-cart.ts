import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cartQuery,
  removeManyItemsFromCartMutation,
} from "~domains/cart/cart.query";

export const useRemoveManyItemsFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...removeManyItemsFromCartMutation,
    onSuccess: () => {
      queryClient.invalidateQueries(cartQuery);
    },
    onError: () => {
      // todo: show error to user
    },
  });
};
