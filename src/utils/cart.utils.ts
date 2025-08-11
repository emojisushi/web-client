import { ICartProduct } from "@layerok/emojisushi-js-sdk";
import { formatUAHPrice } from "~utils/price.utils";

export function recalculateCartTotals(cartProducts: ICartProduct[]) {
  const total = cartProducts.reduce((acc, cartProduct: ICartProduct) => {
    return acc + (cartProduct.quantity * cartProduct.price.UAH) / 100;
  }, 0);

  const totalQuantity = cartProducts.reduce(
    (acc, item: ICartProduct) => acc + item.quantity,
    0
  );

  return {
    total: formatUAHPrice(total),
    totalQuantity,
  };
}
