import * as S from "./styled";
import { SkeletonWrap, SvgIcon } from "~components";
import { UIButton } from "~common/ui-components/UIButton/UIButton";
import { CheckoutCartItem } from "./components/CheckoutCartItem";
import { ModalIDEnum } from "~common/modal.constants";
import { PencilSvg } from "~components/svg/PencilSvg";
import { useTranslation } from "react-i18next";
import { useShowModal } from "~modal";
import { Cart } from "~domains/cart/cart.query";

type CheckoutCartProps = {
  cart?: Cart;
  loading?: boolean;
};

export const CheckoutCart = ({ cart, loading = false }: CheckoutCartProps) => {
  const { t } = useTranslation();
  const items = loading
    ? [
        { quantity: 1, product_id: 128 },
        { quantity: 1, product_id: 129 },
      ]
    : cart?.items || [];

  const showModal = useShowModal();

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
              />
            );
          })}
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
