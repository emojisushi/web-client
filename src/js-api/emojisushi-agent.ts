import axios, { AxiosResponse } from "axios";
import {
  IGetProductsParams,
  IGetProductsRes,
  AxiosAuthRefreshRequestConfig,
  IGetCategoriesParams,
  IGetCategoriesRes,
  IGetCartRes,
  IGetPaymentMethodsRes,
  IGetWishlistRes,
  IGetShippingMethodsRes,
  IGetBannersRes,
  RegisterResData,
  LoginResData,
  IFetchUserResData,
  IAddress,
  IGetCitiesParams,
  IGetSpotsRes,
  ISpot,
  ICity,
  IGetCitiesRes,
  IGetCatalogRes,
  IGetCheckoutFormRes,
  IGetAddresses,
  IGetAddressOptions,
} from "./types";

export function createEmojisushiAgent(options: { service: string }) {
  const { service } = options;
  const axiosClient = axios.create({
    baseURL: service,
  });
  const client = axiosClient;

  function log(data: any, version: string) {
    axiosClient.post("/log", {
      version: version,
      navigator: {
        userAgent: navigator.userAgent,
        online: navigator.onLine,
      },
      ...data,
    });
  }

  function getProducts(
    params: IGetProductsParams,
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.get<IGetProductsRes>("products", {
      params,
      skipAuthRefresh: true,
      ...axiosConfig,
    } as AxiosAuthRefreshRequestConfig);
  }

  function getCatalog(
    params: any,
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.get<IGetCatalogRes>("catalog", {
      params,
      ...axiosConfig,
    });
  }

  function getCheckoutForm(
    params: any,
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.get<IGetCheckoutFormRes>("checkout", {
      params,
      ...axiosConfig,
    });
  }

  function getAddresses(
    params: any,
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.get<IGetAddresses>("addresses", {
      params,
      ...axiosConfig,
    });
  }

  function getAddressOptions(
    params: any,
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.get<IGetAddressOptions>("address/options", {
      params,
      ...axiosConfig,
    });
  }

  function getCategories(
    params: IGetCategoriesParams,
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.get<IGetCategoriesRes>("categories", {
      params,
      skipAuthRefresh: true,
      ...axiosConfig,
    } as AxiosAuthRefreshRequestConfig);
  }

  function getIngredients(
    params = {},
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.get("ingredients", {
      params,
      skipAuthRefresh: true,
      ...axiosConfig,
    } as AxiosAuthRefreshRequestConfig);
  }

  function placeOrder(
    params: {
      phone: string;
      firstname?: string; // це ім'я зберігаеться на сайті
      lastname?: string;
      email?: string;

      shipping_method_id: number;
      payment_method_id: number;
      spot_id: number;
      address?: string;

      comment?: string;
      sticks?: number;
      change?: string;
    },
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.post("order/place", params, axiosConfig);
  }

  function placeOrderV2(
    params: {
      phone: string;
      firstname?: string;
      lastname?: string;
      email?: string;

      shipping_method_id: number;
      payment_method_id: number;
      spot_id: number;
      address?: string;
      address_details?: string;

      comment?: string;
      sticks?: number;
      change?: string;

      cart: {
        items: {
          id: string;
          variant_id?: string;
          quantity: number;
        }[];
      };
    },
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.post("order/v2/place", params, axiosConfig);
  }

  function getCartProducts(
    params = {},
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client
      .get<IGetCartRes>("cart/products", {
        params,
        skipAuthRefresh: true,
        ...axiosConfig,
      } as AxiosAuthRefreshRequestConfig)
      .then((res) => res.data);
  }

  function addCartProduct(
    data: {
      product_id: number;
      variant_id?: number;
      quantity: number;
    },
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ): Promise<IGetCartRes> {
    return client
      .post<IGetCartRes>("cart/add", data, {
        skipAuthRefresh: true,
        ...axiosConfig,
      } as AxiosAuthRefreshRequestConfig)
      .then((res) => res.data);
  }

  function removeCartProduct(
    cart_product_id: string,
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ): Promise<IGetCartRes> {
    return client
      .post<IGetCartRes>(
        "cart/remove",
        {
          cart_product_id,
        },
        {
          skipAuthRefresh: true,
          ...axiosConfig,
        } as AxiosAuthRefreshRequestConfig
      )
      .then((res) => res.data);
  }

  function clearCart(
    data = {},
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.post<IGetCartRes>("cart/clear", data, {
      skipAuthRefresh: true,
      ...axiosConfig,
    } as AxiosAuthRefreshRequestConfig);
  }

  function getPaymentMethods(
    params = {},
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ): Promise<AxiosResponse<IGetPaymentMethodsRes>> {
    return client.get("payments", {
      params,
      ...axiosConfig,
    });
  }

  function addWishlistItem(
    params: {
      product_id: number;
      quantity?: number | null;
    },
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.get("wishlist/add", {
      params,
      ...axiosConfig,
    });
  }
  function getWishlists(
    params: {} = {},
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.get<IGetWishlistRes>("wishlist/list", {
      params,
      ...axiosConfig,
    });
  }

  function getShippingMethods(
    params = {},
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ): Promise<AxiosResponse<IGetShippingMethodsRes>> {
    return client.get("shipping", {
      params,
      ...axiosConfig,
    });
  }

  function getBanners(
    params = {},
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client
      .get<IGetBannersRes>("banners", {
        params,
        skipAuthRefresh: true,
        ...axiosConfig,
      } as AxiosAuthRefreshRequestConfig)
      .then((res) => res.data);
  }

  function register(
    data: {
      email: string;
      password: string;
      password_confirmation: string;
      name: string;
      surname: string;
      activate: boolean;
      auto_login: boolean;
      agree: boolean;
    },
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.post<RegisterResData>("auth/register", data, axiosConfig);
  }

  function login(
    data: { email: string; password: string },
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.post<LoginResData>("auth/login", data, axiosConfig);
  }

  function restorePassword(
    data: {
      email: string;
      redirect_url: string;
    },
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.post("auth/restore-password", data, axiosConfig);
  }

  function resetPassword(
    data: { code: string; password: string },
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.post("auth/reset-password", data, axiosConfig);
  }

  function updateUserPassword(
    data: {
      password_old: string;
      password: string;
      password_confirmation: string;
    },
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.post("user/password", data, axiosConfig);
  }

  function fetchUser(
    params: {} = {},
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.get<IFetchUserResData>("user", {
      params,
      ...axiosConfig,
    });
  }

  function updateUser(
    data: {
      name?: string;
      surname?: string;
      phone?: string;
    },
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.post("user", data, axiosConfig);
  }

  function updateCustomer(
    data: { firstname?: string; lastname?: string },
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.post("user/customer", data, axiosConfig);
  }

  function addAddress(
    data: {
      name: string;
      lines: string;
      zip: string;
      city: string;
      two_letters_country_code?: string;
    },
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.post<IAddress>("user/address", data, axiosConfig);
  }

  function deleteAddress(
    data: {
      id: number;
    },
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.delete("user/address", {
      data,
      ...axiosConfig,
    });
  }

  function makeAddressDefault(
    data: {
      id: number;
    },
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.post("user/address/default", data, axiosConfig);
  }

  const getCitiesDefaults: IGetCitiesParams = {
    includeSpots: false,
  };

  function getSpots(
    params = {},
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client
      .get<IGetSpotsRes>("spots", {
        params,
        skipAuthRefresh: true,
        ...axiosConfig,
      } as AxiosAuthRefreshRequestConfig)
      .then((res) => res.data);
  }

  function getSpot(
    params: { slug_or_id: string | number },
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.get<ISpot>("spot", {
      params,
      skipAuthRefresh: true,
      ...axiosConfig,
    } as AxiosAuthRefreshRequestConfig);
  }

  function getMainSpot(
    params: {} = {},
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.get<ISpot>("spot-main", {
      skipAuthRefresh: true,
      params,
      ...axiosConfig,
    } as AxiosAuthRefreshRequestConfig);
  }

  function getCity(
    params: { slug_or_id: string | number },
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.get<ICity>("city", {
      params,
      skipAuthRefresh: true,
      ...axiosConfig,
    } as AxiosAuthRefreshRequestConfig);
  }

  function getMainCity(
    params: {} = {},
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client.get<ICity>("city-main", {
      skipAuthRefresh: true,
      params,
      ...axiosConfig,
    } as AxiosAuthRefreshRequestConfig);
  }

  function getCities(
    params: IGetCitiesParams = getCitiesDefaults,
    axiosConfig: AxiosAuthRefreshRequestConfig = {}
  ) {
    return client
      .get<IGetCitiesRes>("cities", {
        params,
        skipAuthRefresh: true,
        ...axiosConfig,
      } as AxiosAuthRefreshRequestConfig)
      .then((res) => res.data);
  }

  return {
    axiosClient,
    getProducts,
    getCatalog,
    getCheckoutForm,
    getCategories,
    getIngredients,
    placeOrder,
    placeOrderV2,
    getCartProducts,
    addCartProduct,
    removeCartProduct,
    clearCart,
    getPaymentMethods,
    getWishlists,
    addWishlistItem,
    getShippingMethods,
    getBanners,
    register,
    login,
    restorePassword,
    resetPassword,
    updateUserPassword,
    fetchUser,
    updateUser,
    updateCustomer,
    addAddress,
    deleteAddress,
    makeAddressDefault,
    getCity,
    getMainSpot,
    getMainCity,
    getCities,
    getSpot,
    getSpots,
    log,
    getAddresses,
    getAddressOptions,
  };
}
