import { ProductsGrid } from "~components";
import { useTranslation } from "react-i18next";
import { cartQuery } from "~domains/cart/cart.query";
import { useQuery } from "@tanstack/react-query";
import { useTypedSearchParams } from "react-router-typesafe-routes/dom";
import { ROUTES } from "~routes";
import { useShowBinotel } from "~hooks/use-binotel";
import { catalogQuery } from "~domains/catalog/catalog.query";
import { getGridItems } from "~domains/catalog/catalog.utils";

export const WishlistPage = () => {
  const { t } = useTranslation();
  const [{ q, sort }] = useTypedSearchParams(ROUTES.CATEGORY.WISHLIST);
  const { data: cart, isLoading: isCartLoading } = useQuery(cartQuery);
  const { data: catalogData, isLoading: isCatalogLoading } =
    useQuery(catalogQuery);

  useShowBinotel();

  const items = !isCatalogLoading
    ? getGridItems({
        data: catalogData,
        sort,
        query: q,
        category: "wishlist",
      })
    : [];

  return isCartLoading || isCatalogLoading ? (
    <ProductsGrid loading />
  ) : (
    <ProductsGrid
      wishlists={catalogData.wishlists}
      cart={cart}
      items={items}
      title={t("common.favorite")}
    />
  );
};

export const Component = WishlistPage;

Object.assign(Component, {
  displayName: "LazyWishlistPage",
});
