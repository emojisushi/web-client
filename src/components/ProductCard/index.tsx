import * as S from "./styled";
import { EqualHeightElement } from "react-equal-height";
import React, { useState } from "react";
import { Modificators } from "./components";
import { Price } from "~components/Price";
import { Button } from "~common/ui-components/Button/Button";
import { IGetWishlistRes, IProduct } from "@layerok/emojisushi-js-sdk";
import {
  AnimatedTooltip,
  Counter,
  HeartSvg,
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
import { useAddToWishlist } from "~hooks/use-add-to-wishlist";
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

import { useRemoveProductFromCart } from "~domains/cart/hooks/use-remove-product-from-cart";
import { useAddProductToCart } from "~domains/cart/hooks/use-add-product-to-cart";
import { Cart } from "~domains/cart/cart.query";

type ProductCardProps = {
  product?: IProduct;
  loading?: boolean;
  cart?: Cart;
  wishlists?: IGetWishlistRes;
};

export const ProductCard = (props: ProductCardProps) => {
  const { product, loading = false, cart, wishlists } = props;

  const theme = useTheme();
  const showModal = useShowModal();
  const navigate = useNavigate();

  const { t } = useTranslation();
  const cartProducts = cart?.items || [];

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

  const cartProduct = product
    ? cartProducts.find((item) => item.product_id === product.id)
    : undefined;

  const count = cartProduct?.quantity || 0;

  const { mutate: addProductToCart } = useAddProductToCart();

  const { mutate: removeProductFromCart } = useRemoveProductFromCart();

  const favorite = product && isProductInWishlists(product, wishlists || []);

  const oldPrice =
    product && getOldProductPrice(product, variant)?.price_formatted;
  const newPrice =
    product && getNewProductPrice(product, variant)?.price_formatted;

  const { mutate: addToWishlist } = useAddToWishlist();

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
  const handleFavouriteButtonClick = () => {
    addToWishlist({
      product_id: product.id,
      quantity: count,
    });
  };

  const mainImage = product && getProductMainImage(product);

  return (
    <S.Wrapper>
      <S.FavouriteButtonWrapper>
        <SkeletonWrap borderRadius="100%" loading={loading}>
          <S.FavouriteButton onClick={handleFavouriteButtonClick}>
            <SvgIcon
              clickable={true}
              width={"100%"}
              color={favorite ? theme.colors.brand : "white"}
              hoverColor={theme.colors.brand}
            >
              <HeartSvg />
            </SvgIcon>
          </S.FavouriteButton>
        </SkeletonWrap>
      </S.FavouriteButtonWrapper>
      <SkeletonWrap loading={loading}>
        <S.Image onClick={openDetailedProductModal} src={mainImage}>
          {!mainImage && (
            <SvgIcon color={"white"} width={"80%"} style={{ opacity: 0.05 }}>
              <LogoSvg />
            </SvgIcon>
          )}
        </S.Image>
      </SkeletonWrap>
      <EqualHeightElement name={"product-name"}>
        <S.Name onClick={openDetailedProductModal}>
          {loading ? <Skeleton /> : product.name}
        </S.Name>
        <Modificators
          loading={loading}
          product={product}
          modificators={modificators}
          setModificators={setModificators}
        />
      </EqualHeightElement>
      <EqualHeightElement name={"description"}>
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
      </EqualHeightElement>

      <S.Footer>
        <Price loading={loading} oldPrice={oldPrice} newPrice={newPrice} />
        {count ? (
          <Counter
            handleIncrement={() => {
              addProductToCart({
                quantity: count + 1,
                product_id: product.id,
              });
            }}
            handleDecrement={() => {
              const nextCount = count - 1;
              if (nextCount < 1) {
                removeProductFromCart({
                  product_id: product.id,
                });
              } else {
                addProductToCart({
                  quantity: nextCount,
                  product_id: product.id,
                });
              }
            }}
            count={count}
          />
        ) : (
          <Button
            style={{
              width: 130,
            }}
            startAdornment={
              <StartAdornment>
                <ShoppingBag />
              </StartAdornment>
            }
            showSkeleton={loading}
            onClick={() => {
              addProductToCart({
                quantity: 1,
                product_id: product.id,
              });
            }}
          >
            {t("order.order_btn")}
          </Button>
        )}
      </S.Footer>
    </S.Wrapper>
  );
};
