import React from "react";
import NiceModal from "@ebay/nice-modal-react";

import {
  Modal,
  ModalContent as BaseModalContent,
  Price,
  SkeletonWrap,
  SvgIcon,
  useModal,
} from "~components";
import * as S from "./styled";
import styled, { useTheme } from "styled-components";
import { Times } from "~assets/ui-icons";
import MyCounter from "~components/MyCounter";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PRODUCT_ID_SEARCH_QUERY_PARAM } from "~domains/product/products.query";
import { cartQuery } from "~domains/cart/cart.query";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";
import { useModal as useNiceModal } from "~modal";
import { media } from "~common/custom-media";
import {
  getNewProductPrice,
  getOldProductPrice,
  getProductMainImage,
} from "~domains/product/product.utils";
import { useAddProductToCart } from "~domains/cart/hooks/use-add-product-to-cart";
import { useRemoveItemFromCart } from "~domains/cart/hooks/use-remove-item-from-cart";
import { catalogQuery } from "~domains/catalog/catalog.query";

export const ProductModal = NiceModal.create(() => {
  const modal = useNiceModal();
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();

  const { data, isLoading } = useQuery(catalogQuery);

  const { data: cart } = useQuery(cartQuery);

  const navigate = useNavigate();

  const closeModal = () => {
    modal.remove();
    searchParams.delete(PRODUCT_ID_SEARCH_QUERY_PARAM);
    navigate(
      { search: searchParams.toString() },
      {
        preventScrollReset: true,
      }
    );
  };

  const product = (data?.products || []).find((product) => {
    return product.id === +searchParams.get(PRODUCT_ID_SEARCH_QUERY_PARAM);
  });

  const oldPrice =
    product && getOldProductPrice(product, undefined)?.price_formatted;
  const newPrice =
    product && getNewProductPrice(product, undefined)?.price_formatted;

  const cartItems = cart?.items || [];

  const cartItem =
    product && cartItems.find((item) => item.product.id === product.id);

  const image = product && getProductMainImage(product);

  const count = cartItem?.quantity || 0;

  const { mutate: addProductToCart } = useAddProductToCart();
  const { mutate: removeProductFromCart } = useRemoveItemFromCart();

  const handleIncrement = () => {
    addProductToCart({
      quantity: count + 1,
      product: product,
    });
  };

  const handleDecrement = () => {
    const nextCount = count - 1;
    if (nextCount < 1) {
      removeProductFromCart({
        id: cartItem.id,
      });
    } else {
      addProductToCart({
        quantity: count - 1,
        product: product,
      });
    }
  };

  const handleAddToCart = () => {
    addProductToCart({
      quantity: 1,
      product: product,
    });
  };

  return (
    <Modal open={modal.visible} onClose={closeModal}>
      <ModalContent>
        <ModalCloseButton />
        <S.Wrapper>
          <S.TopWrapper>
            <SkeletonWrap loading={isLoading}>
              <S.Image
                style={{
                  backgroundImage: `url("${image}")`,
                }}
              />
            </SkeletonWrap>
            <S.DescriptionWrapper>
              <S.ProductName>{product?.name || <Skeleton />}</S.ProductName>
              <S.Description>
                {product?.description_short != null ? (
                  product.description_short
                ) : (
                  <Skeleton />
                )}
              </S.Description>
              <S.ProductPrice>
                {isLoading ? (
                  <Skeleton />
                ) : (
                  <Price newPrice={newPrice} oldPrice={oldPrice} />
                )}
              </S.ProductPrice>
            </S.DescriptionWrapper>
          </S.TopWrapper>
          <S.BotWrapper>
            <SkeletonWrap loading={isLoading}>
              {count ? (
                <MyCounter
                  count={count}
                  handleIncrement={handleIncrement}
                  handleDecrement={handleDecrement}
                />
              ) : (
                <S.CartButton onClick={handleAddToCart}>
                  {t("order.modal_order_btn")}
                </S.CartButton>
              )}
            </SkeletonWrap>
          </S.BotWrapper>
        </S.Wrapper>
      </ModalContent>
    </Modal>
  );
});

const ModalContent = styled(BaseModalContent)`
  ${media.lessThan("tablet")`
  border-radius: 0;
`}
`;

const ModalCloseButton = () => {
  const theme = useTheme();
  const { close: closeModal } = useModal();
  return (
    <S.CloseIcon>
      <SvgIcon
        onClick={closeModal}
        color={"white"}
        hoverColor={theme.colors.brand}
        style={{
          cursor: "pointer",
          width: 35,
        }}
      >
        <Times />
      </SvgIcon>
    </S.CloseIcon>
  );
};
