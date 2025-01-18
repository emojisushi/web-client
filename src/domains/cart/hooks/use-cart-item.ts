import { useQuery } from "@tanstack/react-query";
import { CartItem, cartQuery } from "~domains/cart/cart.query";
import { catalogQuery } from "~domains/catalog/catalog.query";

export const useCartItem = (item: CartItem) => {
  const { data: cart } = useQuery(cartQuery);
  const { data: catalog } = useQuery(catalogQuery);

  console.log("catalog", catalog, cart);

  if (!cart || !catalog) {
    return undefined;
  }

  const product = catalog.products.find(
    (product) => product.id === item.product_id
  );
  const variant = product.variants.find(
    (variant) => variant.id === item.variant_id
  );

  return {
    ...item,
    product,
    variant,
  };
};
