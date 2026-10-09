import * as S from "./styled";
import { useTranslation } from "react-i18next";
import { useShowModal } from "~modal";
import { Cart } from "~domains/cart/cart.query";
import { CheckoutRecommendedItem } from "./components/CheckoutRecommendedItem";
import { IProduct } from "~js-api";

type CheckoutCartProps = {
  products?: IProduct[];
  loading?: boolean;
  unavailableCategories?: number[];
  unavailableProducts?: number[];
  cart?: Cart;
};

export const CheckoutRecommended = ({
  products,
  loading = false,
  unavailableCategories = [],
  unavailableProducts = [],
  cart = null,
}: CheckoutCartProps) => {
  const { t } = useTranslation();

  const items = products || [];

  const showModal = useShowModal();
  if (loading) {
    return null;
  }
  const availableCount = items.filter(
    (item) =>
      !(
        unavailableProducts?.includes(item.id) ||
        item.categories.some((cat) => unavailableCategories.includes(cat.id))
      )
  ).length;
  if (availableCount < 1) {
    return null;
  }
  return (
    <S.Wrapper>
      <S.Inner>
        <h3>Також спробуйте:</h3>
        <S.Items>
          {items.map((item) => {
            return (
              <CheckoutRecommendedItem
                key={item?.id}
                loading={loading}
                product={item}
                unavailable={
                  unavailableProducts?.includes(item?.id) ||
                  item?.categories.some((cat) =>
                    unavailableCategories.includes(cat.id)
                  )
                }
                cart={cart}
              />
            );
          })}
        </S.Items>
      </S.Inner>
    </S.Wrapper>
  );
};
