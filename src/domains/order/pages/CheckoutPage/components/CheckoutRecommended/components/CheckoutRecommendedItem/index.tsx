import * as S from "./styled";
import React, { useState } from "react";
import { Modificators } from "~components/ProductCard/components/Modificators";
import { Price } from "~components/Price";
import { Button } from "~common/ui-components/Button/Button";
import { IGetWishlistRes, IProduct } from "@layerok/emojisushi-js-sdk";
import {
  AnimatedTooltip,
  Counter,
  InfoSvg,
  InfoTooltip,
  LogoSvg,
  SkeletonWrap,
  SvgIcon,
} from "~components";
import { useTranslation } from "react-i18next";
import { ReactComponent as ShoppingBag } from "src/assets/ui-icons/shopping-bag.svg";
import { StartAdornment } from "~common/ui-components/Button/StartAdornment";
import { ModalIDEnum } from "~common/modal.constants";
import { useShowModal } from "~modal";
import Skeleton from "react-loading-skeleton";
import { useTheme } from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PRODUCT_ID_SEARCH_QUERY_PARAM } from "~domains/product/products.query";

import { IngredientsTooltipContent } from "~components/ProductCard/components/IngredientsTooltipContent";
import {
  getNewProductPrice,
  getOldProductPrice,
  getProductIngredients,
  getProductMainImage,
  getProductModGroups,
  isProductInWishlists,
} from "~domains/product/product.utils";

import { useRemoveItemFromCart } from "~domains/cart/hooks/use-remove-item-from-cart";
import { useAddProductToCart } from "~domains/cart/hooks/use-add-product-to-cart";
import { Cart } from "~domains/cart/cart.query";

type ProductCardProps = {
  product?: IProduct;
  loading?: boolean;
  cart?: Cart;
  wishlists?: IGetWishlistRes;
  unavailable?: boolean;
};

export const CheckoutRecommendedItem = (props: ProductCardProps) => {
  const {
    product,
    loading = false,
    cart,
    wishlists,
    unavailable = false,
  } = props;

  const theme = useTheme();
  const showModal = useShowModal();
  const navigate = useNavigate();

  const { t } = useTranslation();
  const cartItems = cart?.items || [];

  const initialModificatorsState =
    product &&
    getProductModGroups(product).reduce(
      (acc, group) => ({
        ...acc,
        [group.property.id]: +group.property.options[0].poster_id,
      }),
      {}
    );

  const [modificators, setModificators] = useState(initialModificatorsState);

  const getVariant = (product: IProduct) => {
    return product?.variants.find((variant) => {
      return !!Object.values(modificators).includes(variant.poster_id); // todo: poster_id exists?
    });
  };

  const variant = getVariant(product);

  const cartItem = product
    ? cartItems.find((item) => item.product.id === product.id)
    : undefined;

  const count = cartItem?.quantity || 0;

  const { mutate: addProductToCart } = useAddProductToCart();

  const { mutate: removeProductFromCart } = useRemoveItemFromCart();

  const favorite = product && isProductInWishlists(product, wishlists || []);

  const oldPrice =
    product && getOldProductPrice(product, variant)?.price_formatted;
  const newPrice =
    product && getNewProductPrice(product, variant)?.price_formatted;

  const [searchParams] = useSearchParams();

  const openDetailedProductModal = () => {
    showModal(ModalIDEnum.ProductModal);
    searchParams.set(PRODUCT_ID_SEARCH_QUERY_PARAM, product.id + "");
    navigate(
      { search: searchParams.toString() },
      {
        preventScrollReset: true,
      }
    );
  };

  const mainImage = product && getProductMainImage(product);
  if (unavailable) {
    return null;
  }
  return (
    <S.Wrapper>
      <SkeletonWrap loading={loading}>
        <S.Image onClick={openDetailedProductModal} src={mainImage}>
          {!mainImage && (
            <SvgIcon color={"white"} width={"80%"} style={{ opacity: 0.05 }}>
              <LogoSvg />
            </SvgIcon>
          )}
        </S.Image>
      </SkeletonWrap>
      {/* <EqualHeightElement name={"product-name"}> */}
      <S.Name onClick={openDetailedProductModal}>
        {loading ? <Skeleton /> : product.name}
      </S.Name>
      <Modificators
        loading={loading}
        product={product}
        modificators={modificators}
        setModificators={setModificators}
      />
      {/* </EqualHeightElement> */}
      {/* <EqualHeightElement name={"description"}> */}
      <S.Description>
        <SkeletonWrap loading={loading}>
          <InfoTooltip label={t("menu.weightComment")}>
            <S.Weight>
              {product?.weight !== 0 ? product?.weight + "г" : ""}
              {product?.weight !== 0 && (
                <S.WeightTooltipMarker>?</S.WeightTooltipMarker>
              )}
            </S.Weight>
          </InfoTooltip>
        </SkeletonWrap>
        <SkeletonWrap borderRadius="100%" loading={loading}>
          <AnimatedTooltip
            placement={"bottom-start"}
            label={
              <IngredientsTooltipContent
                items={(product && getProductIngredients(product)) || []}
              />
            }
          >
            <SvgIcon width="25px" color={"#999"}>
              <InfoSvg />
            </SvgIcon>
          </AnimatedTooltip>
        </SkeletonWrap>
      </S.Description>
      {/* </EqualHeightElement> */}

      <S.Footer>
        <Price loading={loading} oldPrice={oldPrice} newPrice={newPrice} />
        <div style={{ marginTop: "4px" }}>
          {count ? (
            <Counter
              type="button"
              handleIncrement={() => {
                addProductToCart({
                  quantity: count + 1,
                  product: product,
                });
              }}
              handleDecrement={() => {
                const nextCount = count - 1;
                if (nextCount < 1) {
                  removeProductFromCart({
                    id: cartItem.id,
                  });
                } else {
                  addProductToCart({
                    quantity: nextCount,
                    product: product,
                  });
                }
              }}
              count={count}
            />
          ) : (
            <Button
              style={{ width: 80 }}
              type="button"
              startAdornment={
                <StartAdornment>
                  <ShoppingBag />
                </StartAdornment>
              }
              showSkeleton={loading}
              onClick={() => {
                addProductToCart({
                  quantity: 1,
                  product: product,
                });
              }}
            >
              {t("order.order_btn")}
            </Button>
          )}
        </div>
      </S.Footer>
    </S.Wrapper>
  );
};
