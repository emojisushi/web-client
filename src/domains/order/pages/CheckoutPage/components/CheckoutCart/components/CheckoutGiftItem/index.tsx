import * as S from "../CheckoutCartItem/styled";
import { LogoSvg, Price, SvgIcon } from "~components";
import { useTranslation } from "react-i18next";
import { CartGift } from "~domains/promotions/cart-gifts";

// A free product from a Poster promotion, listed under the paid items.
export const CheckoutGiftItem = ({ gift }: { gift: CartGift }) => {
  const { t } = useTranslation();
  const img = gift.gift.image ?? undefined;

  return (
    <S.Item>
      <S.Image src={img}>
        {!img && (
          <SvgIcon color={"white"} width={"80%"} style={{ opacity: 0.05 }}>
            <LogoSvg />
          </SvgIcon>
        )}
      </S.Image>

      <S.Content>
        <S.Name>{gift.gift.name}</S.Name>
        <S.Description>
          <S.Count>{gift.quantity} шт</S.Count>
        </S.Description>
        <S.Price>
          <Price
            newPrice={t("cartModal.gift")}
            oldPrice={gift.gift.price_formatted ?? undefined}
          />
        </S.Price>
      </S.Content>
    </S.Item>
  );
};
