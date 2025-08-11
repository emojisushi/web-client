import { ProductsGrid } from "~components";
import { useQuery } from "@tanstack/react-query";
import { cartQuery } from "~domains/cart/cart.query";
import { DefaultErrorBoundary } from "~components/DefaultErrorBoundary";
import { ROUTES } from "~routes";
import {
  useTypedParams,
  useTypedSearchParams,
} from "react-router-typesafe-routes/dom";
import { useShowBinotel } from "~hooks/use-binotel";
import { catalogQuery } from "~domains/catalog/catalog.query";
import { getGridItems } from "~domains/catalog/catalog.utils";

export const ProductPage = () => {
  const { categorySlug } = useTypedParams(ROUTES.CATEGORY.SHOW);
  useShowBinotel();

  const [{ q: query, sort }] = useTypedSearchParams(ROUTES.CATEGORY.SHOW);

  const { data: cart, isLoading: isCartLoading } = useQuery(cartQuery);

  const { data: catalogData, isLoading: isCatalogLoading } =
    useQuery(catalogQuery);

  const items = !isCatalogLoading
    ? getGridItems({
        data: catalogData,
        sort,
        query,
        category: categorySlug,
      })
    : [];

  const selectedCategory = (catalogData?.categories || []).find((category) => {
    return category.slug === categorySlug;
  });

  return isCartLoading || isCatalogLoading ? (
    <ProductsGrid loading />
  ) : (
    <div style={{ flexGrow: 1 }}>
      <ProductsGrid
        wishlists={catalogData.wishlists}
        cart={cart}
        title={selectedCategory?.name}
        loading={false}
        items={items}
      />
    </div>
  );
};

export const Component = ProductPage;

Object.assign(Component, {
  displayName: "LazyCategoryPage",
});

export const ErrorBoundary = DefaultErrorBoundary;
