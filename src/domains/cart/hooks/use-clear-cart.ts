import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartQuery, clearCartMutation } from "~domains/cart/cart.query";

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...clearCartMutation,
    onSuccess: () => {
      queryClient.invalidateQueries(cartQuery);
      // todo: clear cart after you redirected user to thankyou page
      // otherwise user will be redirected to category page
      // await queryClient.removeQueries(cartQuery.queryKey);
    },
    onError: () => {
      // todo: show error to user
    },
  });
};
