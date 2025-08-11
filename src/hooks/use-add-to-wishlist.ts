import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";
import { catalogQuery } from "~domains/catalog/catalog.query";

import { arrImmutableDeleteAt } from "~utils/arr.utils";
import { IGetCatalogRes } from "@layerok/emojisushi-js-sdk";

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      product_id,
      quantity,
    }: {
      product_id: number;
      quantity: number;
    }) => {
      return EmojisushiAgent.addWishlistItem({
        product_id,
        quantity,
      });
    },
    onMutate: ({ product_id, quantity }) => {
      queryClient.setQueryData(
        catalogQuery.queryKey,
        addProductToWishlistUpdater({ product_id, quantity })
      );
    },
    onError: () => {
      queryClient.fetchQuery(catalogQuery.queryKey);
    },
  });
};

function addProductToWishlistUpdater({
  product_id,
  quantity,
}: {
  product_id: number;
  quantity: number;
}) {
  return function (oldCatalog: IGetCatalogRes) {
    const firstWishlist = oldCatalog.wishlists[0] || {
      items: [],
      id: 0,
    };
    const wishlistItem = firstWishlist.items.find(
      (item) => item.product_id === product_id
    );
    if (wishlistItem) {
      const index = firstWishlist.items.indexOf(wishlistItem);
      const items = arrImmutableDeleteAt(firstWishlist.items, index);
      return {
        ...oldCatalog,
        wishlists: [
          {
            ...firstWishlist,
            items,
          },
          ...oldCatalog.wishlists.slice(1),
        ],
      };
    } else {
      const firstWishlist = oldCatalog.wishlists[0] || {
        items: [],
        id: 0,
      };
      const item = {
        product_id: product_id,
        quantity: quantity,
        wishlists_id: firstWishlist.id,
      };

      return {
        ...oldCatalog,
        wishlists: [
          {
            ...firstWishlist,
            items: [...firstWishlist.items, item],
          },
          ...oldCatalog.wishlists.slice(1),
        ],
      };
    }
  };
}
