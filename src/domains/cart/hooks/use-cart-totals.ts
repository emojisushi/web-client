import { useQuery } from "@tanstack/react-query";
import { cartQuery } from "~domains/cart/cart.query";
import { catalogQuery } from "~domains/catalog/catalog.query";
import { getNewProductPrice } from "~domains/product/product.utils";

export const useCartTotals = () => {
  const { data: cart } = useQuery(cartQuery);
  const { data: catalog } = useQuery(catalogQuery);

  if (!cart || !catalog) {
    return {
      total: "0 грн",
      totalQuantity: 0,
    };
  }

  const total = cart.items.reduce((acc, item) => {
    const product = catalog.products.find(
      (product) => product.id === item.product_id
    );
    const variant = product.variants.find(
      (variant) => variant.id === item.variant_id
    );
    return (
      acc + item.quantity * (getNewProductPrice(product, variant).price / 100)
    );
  }, 0);

  const totalQuantity = cart.items.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

  return {
    total: total + " грн.",
    totalQuantity: totalQuantity,
  };
};
