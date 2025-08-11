import { ICartProduct, IProduct, IVariant } from "@layerok/emojisushi-js-sdk";

export const findInCart = (
  items: ICartProduct[],
  product: IProduct,
  variant?: IVariant
) => {
  if (product.inventory_management_method === "variant") {
    return items.find(
      (cartProduct) =>
        cartProduct.product_id === product.id &&
        cartProduct.variant_id === variant?.id
    );
  }
  return items.find((cartProduct) => cartProduct.product_id === product.id);
};
