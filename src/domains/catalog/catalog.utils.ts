import { IGetCatalogRes, IProduct } from "@layerok/emojisushi-js-sdk";
import { fuzzySearch as fuzzySearchBase } from "~utils/fuzzySearch";
import { PRODUCT_SORTERS } from "~domains/product/product.constants";
import { isProductInWishlists } from "~domains/product/product.utils";

export const getGridItems = ({
  data,
  category: categorySlug,
  query,
  sort,
}: {
  category?: string;
  query: string;
  sort: string;
  data: IGetCatalogRes;
}) => {
  // todo: do not hardcode
  const isWishlistCategory = categorySlug === "wishlist";

  const belongsToCategory = (product: IProduct) => {
    if (isWishlistCategory) {
      return true;
    }
    const categoryExists = data.categories.find(
      (category) => category.slug === categorySlug
    );
    if (!categoryExists) {
      // category is hidden, do not show this product
      return false;
    }
    return !!product.categories.find(
      (category) => category.slug === categorySlug
    );
  };

  const filterProductsFromHiddenCategories = (product: IProduct) => {
    if (isWishlistCategory) {
      return true;
    }
    return product.categories.some((category) => {
      const categoryExists = data.categories.find(
        (categoryInner) => categoryInner.slug === category.slug
      );
      return categoryExists;
    });
  };

  const rawItems = (data.products || []).filter(
    query ? filterProductsFromHiddenCategories : belongsToCategory
  );

  const searchedItems = query
    ? fuzzySearchBase(rawItems, query, (el) => el.name, {
        maxAllowedModifications: 1,
      })
    : rawItems;

  // todo: implement 'bestseller' and 'rating' sorters
  const sorter = PRODUCT_SORTERS[sort];

  const sortedProducts = sorter ? searchedItems.sort(sorter) : searchedItems;

  if (isWishlistCategory) {
    if (!data.wishlists?.length) {
      return [];
    }
    return sortedProducts.filter((product) =>
      isProductInWishlists(product, data.wishlists)
    );
  }

  return sortedProducts;
};
