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
import { Helmet } from "react-helmet";

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

  const title = selectedCategory
    ? `${selectedCategory.name} | EmojiSushi - роли та піца`
    : "Emoji Sushi | Суші та роли";

  const description = selectedCategory
    ? `Замовляйте ${selectedCategory.name.toLowerCase()} в Emoji Sushi 🍣 — швидка доставка по Одесі, свіжі інгредієнти, акційні сети.`
    : "Emoji Sushi — доставка суші, ролів, піци та супів в Одесі. Смачні сети, вигідні акції та швидка доставка.";

  const url = `https://emojisushi.com.ua/${categorySlug || ""}`;

  return isCartLoading || isCatalogLoading ? (
    <ProductsGrid loading />
  ) : (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div id={"products"} style={{ flexGrow: 1 }}>
        <ProductsGrid
          wishlists={catalogData.wishlists}
          cart={cart}
          title={selectedCategory?.name}
          loading={false}
          items={items}
        />
      </div>
    </>
  );
};

export const Component = ProductPage;

Object.assign(Component, {
  displayName: "LazyCategoryPage",
});

export const ErrorBoundary = DefaultErrorBoundary;
