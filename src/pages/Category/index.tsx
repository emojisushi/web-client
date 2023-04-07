import { ProductsGrid } from "~components/ProductsGrid";
import { observer } from "mobx-react";
import {
  Await,
  defer,
  useAsyncValue,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
  useRouteLoaderData,
  useSearchParams,
} from "react-router-dom";
import { useLang, useSpotSlug } from "~hooks";
import { FlexBox } from "~components/FlexBox";
import { Banner } from "./Banner";
import { useIsDesktop } from "~common/hooks/useBreakpoint";
import { Sidebar } from "~pages/Category/Sidebar";
import { Suspense } from "react";
import { QueryClient } from "react-query";
import { IGetProductsResponse } from "~api/menu.api";
import { ICategory, SortKey } from "~api/menu.api.types";
import { queryClient } from "~query-client";
import { Product } from "~models/Product";
import WishlistApi, { IGetWishlistResponse } from "~api/wishlist.api";
import { wishlistsQuery } from "~queries";
import { IGetCategoriesResponse } from "~api/menu.api";
import { productsQuery } from "~queries";
import { CategoriesLoaderResolvedData } from "~pages/Categories";

export const Category = observer(() => {
  const isDesktop = useIsDesktop();

  const { categories }: CategoriesLoaderResolvedData = useRouteLoaderData(
    "categories"
  ) as any;

  // if (!selectedCategory && categories.length > 0) {
  //   return <Navigate to={categories[0].slug} />;
  // }

  return (
    <>
      {false && <Banner />}
      <FlexBox flexDirection={isDesktop ? "row" : "column"}>
        <Suspense
          fallback={
            <>
              <Sidebar showSkeleton />
              <ProductsGrid showSkeleton />
            </>
          }
        >
          <Await resolve={categories}>
            <AwaitedCategory />
          </Await>
        </Suspense>
      </FlexBox>
    </>
  );
});

export const AwaitedCategory = () => {
  const spotSlug = useSpotSlug();
  const categories = useAsyncValue() as IGetCategoriesResponse;

  const publishedCategories = categories.data
    .filter((category) => category.published)
    .filter((category) => {
      return !category.hide_categories_in_spot
        .map((spot) => spot.slug)
        .includes(spotSlug);
    });

  const { productsQuery } = useLoaderData() as ReturnType<
    typeof loader
  >["data"];

  return (
    <>
      <Sidebar categories={publishedCategories} />
      <Await resolve={productsQuery}>
        <AwaitedProducts categories={publishedCategories} />
      </Await>
    </>
  );
};

export const AwaitedProducts = ({
  categories,
}: {
  categories: ICategory[];
}) => {
  const { categorySlug, spotSlug, citySlug } = useParams();
  const [searchParams] = useSearchParams();
  const limit = searchParams.get("limit") || PRODUCTS_LIMIT_STEP;
  const navigation = useNavigation();
  const lang = useLang();
  const navigate = useNavigate();

  const selectedCategory = categories.find((category) => {
    return category.slug === categorySlug;
  });
  const title = selectedCategory?.name;

  const handleLoadMore = () => {
    const nextLimit = +limit + PRODUCTS_LIMIT_STEP;
    navigate(
      "/" +
        [lang, citySlug, spotSlug, "category", categorySlug].join("/") +
        "?limit=" +
        nextLimit
    );
  };
  const productsQuery = useAsyncValue() as IGetProductsResponse;
  const items = productsQuery.data
    .map((product) => new Product(product))
    .filter((product: Product) => {
      return !product.isHiddenInSpot(spotSlug);
    });
  // todo: Total is not right because hidden products are also counted
  const total = productsQuery.total;

  // todo: show skeleton while searching products
  return (
    <ProductsGrid
      handleLoadMore={handleLoadMore}
      title={title}
      showSkeleton={false}
      loadable={total > items.length}
      loading={navigation.state === "loading"}
      items={items}
    />
  );
};

export const Component = Category;

Object.assign(Component, {
  displayName: "LazyCategoryPage",
});

export const PRODUCTS_LIMIT_STEP = 25;

export type CategoryLoaderResolvedDeferredData = {
  productsQuery: IGetProductsResponse;
  wishlistQuery: IGetWishlistResponse;
  q: string | undefined;
  sort: string | undefined;
};

export const querifiedLoader = (queryClient: QueryClient) => {
  return ({ params, request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit") || PRODUCTS_LIMIT_STEP;
    const q = url.searchParams.get("q");
    const sort = url.searchParams.get("sort") as SortKey;
    const productQuery = productsQuery({
      category_slug: q || !params.categorySlug ? "menu" : params.categorySlug,
      search: q,
      sort: sort,
      offset: 0,
      limit: +limit,
    });

    return defer({
      productsQuery:
        queryClient.getQueryData(productQuery.queryKey) ??
        queryClient.fetchQuery(productQuery),
      wishlistQuery:
        queryClient.getQueryData(wishlistsQuery.queryKey) ??
        queryClient.fetchQuery(wishlistsQuery),
      q,
      sort,
    } as CategoryLoaderResolvedDeferredData);
  };
};

export const loader = querifiedLoader(queryClient);

// todo: duplicated code, the same action is defined on the Wishlist page
export const categoryAction = async ({ request }) => {
  let formData = await request.formData();
  const product_id = formData.get("product_id");
  const quantity = formData.get("quantity");

  const res = await WishlistApi.addItem({
    product_id,
    quantity,
  });
  queryClient.setQueryData(wishlistsQuery.queryKey, res.data);
  return res.data;
};

export const action = categoryAction;
