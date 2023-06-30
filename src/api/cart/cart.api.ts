import { client } from "~clients/client";
import { ICartProduct, IGetCartRes } from "./cart.api.types";
import { AxiosAuthRefreshRequestConfig } from "axios-auth-refresh";

const getCartProducts = (params = {}) => {
  return client
    .get<IGetCartRes>("cart/products", {
      params,
      skipAuthRefresh: true,
    } as AxiosAuthRefreshRequestConfig)
    .then((res) => res.data);
};

function addCartProduct(data: {
  product_id: number;
  variant_id?: number;
  quantity: number;
}) {
  return client.post<{
    data: ICartProduct[];
    total: string;
    totalQuantity: number;
  }>("cart/add", data, {
    skipAuthRefresh: true,
  } as AxiosAuthRefreshRequestConfig);
}

function removeCartProduct(cart_product_id) {
  return client.post<{
    data: ICartProduct[];
    total: string;
    totalQuantity: number;
  }>(
    "cart/remove",
    {
      cart_product_id,
    },
    {
      skipAuthRefresh: true,
    } as AxiosAuthRefreshRequestConfig
  );
}

function clearCart(data = {}) {
  return client.post<{
    data: ICartProduct[];
    total: string;
    totalQuantity: number;
  }>("cart/clear", data, {
    skipAuthRefresh: true,
  } as AxiosAuthRefreshRequestConfig);
}

export const cartApi = {
  getProducts: getCartProducts,
  addProduct: addCartProduct,
  removeCartProduct,
  clearCart,
};
