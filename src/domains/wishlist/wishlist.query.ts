import { QueryOptions } from "@tanstack/react-query";
import { IGetWishlistRes } from "@layerok/emojisushi-js-sdk";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";

export const wishlistsQuery: QueryOptions<IGetWishlistRes> = {
  queryKey: ["wishlists", "list", "all"],
  queryFn: () => {
    return EmojisushiAgent.getWishlists().then((res) => res.data);
  },
};
