import {
  Navigate,
  Outlet,
  ScrollRestoration,
  useSearchParams,
} from "react-router-dom";
import { useAppStore } from "~stores/appStore";
import { LOCATION_CONFIRMED_SEARCH_PARAM } from "~common/constants";
import { DefaultErrorBoundary } from "~components/DefaultErrorBoundary";
import { useRemoveManyItemsFromCart } from "~domains/cart/hooks/use-remove-many-items-from-cart";
import { useQuery } from "@tanstack/react-query";
import { catalogQuery } from "~domains/catalog/catalog.query";
import { cartQuery } from "~domains/cart/cart.query";
import { useEffect } from "react";
import {
  getNewProductPrice,
  getOldProductPrice,
} from "~domains/product/product.utils";

const useAutomaticallyRemoveOldProductsFromCart = () => {
  const { mutate: removeManyItemsFromCart } = useRemoveManyItemsFromCart();

  const { data: catalogData } = useQuery(catalogQuery);
  const { data: cart } = useQuery(cartQuery);

  useEffect(() => {
    const staleItems = (cart?.items || []).filter((item) => {
      const product = catalogData.products.find(
        (product) => item.product.id === product.id
      );

      if (!product) {
        // product doesn't exist in catalog anymore
        return true;
      }

      if (
        getNewProductPrice(product, undefined)?.price !==
        getNewProductPrice(item.product, item.variant)?.price
      ) {
        // product 'new' price doesn't match product 'new' price in cart
        return true;
      }

      if (
        getOldProductPrice(product, undefined)?.price !==
        getOldProductPrice(item.product, item.variant)?.price
      ) {
        // product 'old' price doesn't match product 'old' price in cart
        return true;
      }

      return false;
    });

    if (staleItems.length) {
      removeManyItemsFromCart(
        {
          ids: staleItems.map((item) => item.id),
        },
        {
          onSuccess: () => {
            // todo: should I tell user that 'old' products were deleted from the cart
          },
          onError: () => {
            // todo: should I log failure to remove 'old' products from cart
          },
        }
      );
    }
  }, [catalogData]);
};

const RootPage = () => {
  const [searchParams] = useSearchParams();
  const appStore = useAppStore();
  useAutomaticallyRemoveOldProductsFromCart();

  if (searchParams.has(LOCATION_CONFIRMED_SEARCH_PARAM)) {
    searchParams.delete(LOCATION_CONFIRMED_SEARCH_PARAM);
    appStore.setUserConfirmedLocation(true);
    return (
      <Navigate
        replace
        to={{
          search: searchParams.toString(),
        }}
      />
    );
  }
  return (
    <>
      <Outlet />
      <ScrollRestoration
        getKey={(location, matches) => {
          // default behavior
          return location.key;
        }}
      />
    </>
  );
};

export const Component = RootPage;

export const ErrorBoundary = DefaultErrorBoundary;
