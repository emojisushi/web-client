import { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { useQuery } from "@tanstack/react-query";
import NiceModal from "@ebay/nice-modal-react";
import * as S from "./styled";
import {
  FlexBox,
  Modal,
  Price,
  SvgIcon,
  LogoSvg,
  // todo: replace SushiSvg because it is fake svg, it is png actually
  SushiSvg,
} from "~components";
import {
  CartItem as CartItemPayload,
  cartQuery,
} from "~domains/cart/cart.query";

import { ROUTES } from "~routes";
import { useModal } from "~modal";

import { Button } from "~common/ui-components/Button/Button";

import { useBreakpoint2 } from "~common/hooks";

import { Times } from "~assets/ui-icons";
import {
  getCartProductNameWithMods,
  getNewProductPrice,
  getOldProductPrice,
  getProductMainImage,
} from "~domains/product/product.utils";

import { Counter } from "~components/modals/CartModal/components/Counter";
import { useAddProductToCart } from "~domains/cart/hooks/use-add-product-to-cart";
import { useRemoveItemFromCart } from "~domains/cart/hooks/use-remove-item-from-cart";

// todo: clear outdated products from the card. You can do it on the frontend or on the backend
const CartItem = (props: { item: CartItemPayload }) => {
  const { item: cartItem } = props;
  const theme = useTheme();

  const { product, variant } = cartItem;

  const newPrice = getNewProductPrice(product, variant)?.price_formatted;
  const oldPrice = getOldProductPrice(product, variant)?.price_formatted;
  const nameWithMods = getCartProductNameWithMods(product, variant);

  const count = cartItem?.quantity || 0;

  const { mutate: addProductToCart } = useAddProductToCart();

  const { mutate: removeProductFromCart } = useRemoveItemFromCart();

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

  const handleIncrement = () => {
    addProductToCart({
      quantity: count + 1,
      product: product,
    });
  };
  const handleDelete = () => {
    removeProductFromCart({
      id: cartItem.id,
    });
  };

  const mainImage = getProductMainImage(product);

  return (
    <S.Item>
      <S.ItemRemoveIcon>
        <SvgIcon
          onClick={handleDelete}
          color={theme.colors.grey[450]}
          hoverColor={theme.colors.brand}
          style={{
            cursor: "pointer",
            width: 25,
          }}
        >
          <Times />
        </SvgIcon>
      </S.ItemRemoveIcon>
      <S.ItemImg src={mainImage}>
        {!mainImage && (
          <SvgIcon color={"white"} width={"80%"} style={{ opacity: 0.05 }}>
            <LogoSvg />
          </SvgIcon>
        )}
      </S.ItemImg>
      <S.ItemInfo>
        <S.ItemName title={nameWithMods}>{nameWithMods}</S.ItemName>
        <FlexBox justifyContent={"space-between"} alignItems={"flex-end"}>
          <S.ItemCounter>
            <Counter
              handleIncrement={handleIncrement}
              handleDecrement={handleDecrement}
              count={count}
            />
          </S.ItemCounter>
          <Price newPrice={newPrice} oldPrice={oldPrice} />
        </FlexBox>
      </S.ItemInfo>
    </S.Item>
  );
};

export const CartModal = NiceModal.create(() => {
  const navigate = useNavigate();
  const modal = useModal();
  const theme = useTheme();

  const { data: cart, isLoading: isCartLoading } = useQuery(cartQuery);

  const { items } = cart;

  const { isMobile } = useBreakpoint2();

  const { t } = useTranslation();

  const overlayStyles = {
    ...(!isMobile && {
      justifyItems: "end",
      justifyContent: "end",
      alignItems: "start",
    }),
  };

  // max cart items wrapper height is 500px and min is 300px
  // 252px is sum of heights another element in cart modal
  const finalHeight = Math.max(Math.min(500 - 252, 500), 300);

  const itemsContainerStyles: CSSProperties = {
    minHeight: isMobile ? "auto" : 362 + "px",
    maxHeight: isMobile ? "calc(100vh - 250px)" : finalHeight + "px",
    overflowY: "auto",
  };

  const checkout = () => {
    navigate(ROUTES.CHECKOUT.path);
    modal.remove();
  };

  const closeModal = () => {
    modal.remove();
  };

  return (
    <Modal
      open={modal.visible}
      onClose={closeModal}
      overlayStyles={overlayStyles}
    >
      <S.Wrapper>
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

        {items.length === 0 && (
          <S.EmptyCartImgContainer>
            <SushiSvg />
            <S.Title>{t("cartModal.empty")}</S.Title>
          </S.EmptyCartImgContainer>
        )}

        {items.length !== 0 && (
          <S.Items style={itemsContainerStyles}>
            {items.map((item, i) => (
              <CartItem
                key={[item.product.id, item.variant?.id]
                  .filter(Boolean)
                  .join(".")}
                item={item}
              />
            ))}
          </S.Items>
        )}

        {items.length !== 0 && (
          <S.Footer>
            <FlexBox alignItems={"center"} justifyContent={"space-between"}>
              <S.Sum>{t("cartModal.sum_order")}</S.Sum>
              <Price newPrice={cart.total} />
            </FlexBox>
            <S.Button>
              <Button
                disabled={items.length === 0}
                onClick={checkout}
                style={{
                  width: "100%",
                }}
              >
                {t("cartModal.checkout")}
              </Button>
            </S.Button>
          </S.Footer>
        )}
      </S.Wrapper>
    </Modal>
  );
});
