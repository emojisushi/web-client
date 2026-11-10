import * as S from "./styled";
import { SkeletonWrap, SvgIcon } from "~components";
import { UIButton } from "~common/ui-components/UIButton/UIButton";
import { CheckoutCartItem } from "./components/CheckoutCartItem";
import { CheckoutGiftItem } from "./components/CheckoutGiftItem";
import { ModalIDEnum } from "~common/modal.constants";
import { PencilSvg } from "~components/svg/PencilSvg";
import { useTranslation } from "react-i18next";
import { useShowModal } from "~modal";
import { Cart } from "~domains/cart/cart.query";
import { useQuery } from "@tanstack/react-query";
import { posterPromotionsQuery } from "~domains/promotions/poster-promotions.query";
import { getCartGifts } from "~domains/promotions/cart-gifts";
import { useKyivTime } from "~domains/promotions/promotion-window";

type CheckoutCartProps = {
  cart?: Cart;
  loading?: boolean;
  unavailableCategories?: number[];
  unavailableProducts?: number[];
};

export const CheckoutCart = ({
  cart,
  loading = false,
  unavailableCategories = [],
  unavailableProducts = [],
}: CheckoutCartProps) => {
  const { t } = useTranslation();
  const items = loading
    ? [
        { quantity: 1, product_id: 128 },
        { quantity: 1, product_id: 129 },
      ]
    : cart?.items || [];

  const showModal = useShowModal();

  const { data: posterPromotions } = useQuery(posterPromotionsQuery);
  const kyivNow = useKyivTime();
  const gifts = loading
    ? []
    : getCartGifts(cart?.items, posterPromotions, { time: kyivNow });

  return (
    <S.Wrapper>
      <S.Inner>
        <S.Items>
          {items.map((item) => {
            return (
              <CheckoutCartItem
                key={item.product_id}
                loading={loading}
                item={item}
                unavailable={
                  unavailableProducts?.includes(item.product?.id) ||
                  item?.product?.categories.some((cat) =>
                    unavailableCategories.includes(cat.id)
                  )
                }
              />
            );
          })}
          {gifts.map((gift) => (
            <CheckoutGiftItem key={"gift-" + gift.promotion.id} gift={gift} />
          ))}
        </S.Items>

        <S.EditButton>
          <SkeletonWrap loading={loading}>
            <UIButton
              onClick={() => {
                showModal(ModalIDEnum.CartModal);
              }}
              text={t("editBtn.edit_order")}
            >
              <SvgIcon color={"white"} width={"25px"}>
                <PencilSvg />
              </SvgIcon>
            </UIButton>
          </SkeletonWrap>
        </S.EditButton>
      </S.Inner>
    </S.Wrapper>
  );
};
