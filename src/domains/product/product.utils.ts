import {
  IPrice,
  IProduct,
  IPropertyValue,
  IVariant,
  IWishlist,
} from "@layerok/emojisushi-js-sdk";

export function getProductMainImage(product: IProduct): string | undefined {
  const imageSets = product.image_sets || [];
  if (imageSets.length < 1) {
    return undefined;
  }
  if (imageSets[0].images.length < 1) {
    return undefined;
  }
  return imageSets[0].images[0].path;
}

export function getOldProductPrice(
  product: IProduct,
  variant: IVariant
): IPrice | undefined {
  if (variant) {
    return getVariantOldPrice(variant);
  }

  if (product.additional_prices.length < 1) {
    return undefined;
  }

  return product.additional_prices[0];
}

export function getNewProductPrice(
  product: IProduct,
  variant: IVariant
): IPrice | undefined {
  if (variant) {
    return getVariantNewPrice(variant);
  }
  if (product.prices.length < 1) {
    return undefined;
  }

  return product.prices[0];
}

export function getProductModGroups(product: IProduct): IPropertyValue[] {
  return (product.property_values || [])
    .filter((value) => {
      return value.property?.options?.length > 0;
    })
    .reduce((acc, property) => {
      if (acc.includes(property.property_id)) {
        return acc;
      }
      return [...acc, property.property_id];
    }, [])
    .map((id) => {
      return (product.property_values || []).find(
        (property) => property.property_id === id
      );
    });
}

export function isProductInWishlist(product: IProduct, wishlist: IWishlist) {
  for (let j = 0; j < wishlist.items.length; j++) {
    const item = wishlist.items[j];
    if (
      item.product_id === product.id &&
      (!item.variant_id ||
        product.variants.map((v) => v.id).includes(item.variant_id))
    ) {
      return true;
    }
  }

  return false;
}

export function isProductInWishlists(
  product: IProduct,
  wishlists: IWishlist[]
): boolean {
  for (let i = 0; i < wishlists.length; i++) {
    const wishlist = wishlists[i];
    if (isProductInWishlist(product, wishlist)) {
      return true;
    }
  }
  return false;
}

export function getProductIngredients(product: IProduct) {
  return product.description_short ? product.description_short.split(",") : [];
}

export function getVariantNewPrice(variant: IVariant) {
  return variant.prices.length > 0 ? variant.prices[0] : undefined;
}

export function getVariantOldPrice(variant: IVariant) {
  return variant.additional_prices.length > 0
    ? variant.additional_prices[0]
    : undefined;
}

export function getTotalCartProductPrice(
  product: IProduct,
  variant?: IVariant
) {
  return getNewProductPrice(product, variant).price * this.quantity;
}

export function getCartProductNameWithMods(
  product: IProduct,
  variant?: IVariant
) {
  return (variant?.property_values || []).reduce((acc, property) => {
    return acc + " " + property.value;
  }, product.name as string);
}
