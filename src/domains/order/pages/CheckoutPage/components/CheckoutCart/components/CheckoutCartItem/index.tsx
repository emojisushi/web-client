import * as S from "./styled";
import {
  AnimatedTooltip,
  FlexBox,
  InfoSvg,
  LogoSvg,
  Price,
  SvgIcon,
} from "~components";
import Skeleton from "react-loading-skeleton";
import { IngredientsTooltipContent } from "../IngredientsTooltipContent";
import {
  getCartProductNameWithMods,
  getNewProductPrice,
  getOldProductPrice,
  getProductIngredients,
  getProductMainImage,
} from "~domains/product/product.utils";
import { ICartProduct } from "@layerok/emojisushi-js-sdk";
import { CartItem } from "~domains/cart/cart.query";
import { useCartItem } from "~domains/cart/hooks/use-cart-item";
import { dummyCartProduct } from "~domains/order/mocks";

type CheckoutCartItemProps = {
  item: CartItem;
  loading?: boolean;
};

export const CheckoutCartItem = ({
  item,
  loading = false,
}: CheckoutCartItemProps) => {
  const cartItem = useCartItem(item);
  console.log("cartItem", cartItem, item);
  const { quantity, product, variant } = loading
    ? dummyCartProduct
    : cartItem || {};

  const nameWithMods = getCartProductNameWithMods(product, variant);

  const img = getProductMainImage(product);

  const renderDelimeter = () => {
    if (loading) {
      return (
        <Skeleton
          style={{
            margin: "0 10px",
          }}
          width={1}
          height={13}
        />
      );
    }
    return <S.Delimiter />;
  };

  const renderQuantity = () => {
    return (
      <S.Count>
        {loading ? <Skeleton width={30} /> : quantity + " " + "шт"}{" "}
      </S.Count>
    );
  };

  const renderWeight = () => {
    const weight = product?.weight;
    const formatted = weight === 0 ? "" : weight + "г";
    return (
      <S.Weight>
        {loading ? <Skeleton width={30} /> : formatted} &nbsp;
      </S.Weight>
    );
  };

  const renderImage = () => {
    if (loading) {
      return (
        <S.Image src={undefined}>
          <Skeleton width="100%" height="100%" />
        </S.Image>
      );
    }

    if (!img) {
      return (
        <S.Image src={img}>
          <SvgIcon color={"white"} width={"80%"} style={{ opacity: 0.05 }}>
            <LogoSvg />
          </SvgIcon>
        </S.Image>
      );
    }

    return <S.Image src={loading ? undefined : img} />;
  };

  const renderPrice = () => {
    if (loading) {
      return <Skeleton width={50} height={24} />;
    }

    const oldPrice = getOldProductPrice(product, variant)?.price_formatted;
    const newPrice = getNewProductPrice(product, variant)?.price_formatted;
    return (
      <S.Price>
        <Price newPrice={newPrice} oldPrice={oldPrice} />
      </S.Price>
    );
  };

  const renderIngredientsTooltip = () => {
    const ingredients = product ? getProductIngredients(product) : [];
    if (ingredients.length < 1) {
      return null;
    }
    return (
      <AnimatedTooltip
        placement={"bottom-start"}
        label={<IngredientsTooltipContent items={ingredients} />}
      >
        <SvgIcon width="25px" color={"#999"}>
          <InfoSvg />
        </SvgIcon>
      </AnimatedTooltip>
    );
  };

  return (
    <S.Item>
      {renderImage()}

      <S.Content>
        <S.Name>{loading ? <Skeleton /> : nameWithMods}</S.Name>
        <S.Description>
          <FlexBox>
            {renderQuantity()}
            {product?.weight !== 0 && renderDelimeter()}
            {renderWeight()}
          </FlexBox>

          {renderIngredientsTooltip()}
        </S.Description>
        {renderPrice()}
      </S.Content>
    </S.Item>
  );
};
