import * as S from "./styled";
import { Button } from "~common/ui-components/Button/Button";
import React from "react";
import {
  getNewProductPrice,
  getOldProductPrice,
  getProductMainImage,
} from "~domains/product/product.utils";
import { IProduct } from "@layerok/emojisushi-js-sdk";
import { useAddProductToCart } from "~domains/cart/hooks/use-add-product-to-cart";
import { CartItem } from "~domains/cart/cart.query";

export const ProductCard = ({
  product,
  cartItem,
}: {
  product: IProduct;
  cartItem?: CartItem;
}) => {
  const { mutate: addProductToCart } = useAddProductToCart();
  const addToCart = () => {
    addProductToCart({
      quantity: 1,
      variant: undefined,
      product: product,
    });
  };
  const newPrice = getNewProductPrice(product, undefined)?.price_formatted;
  const oldPrice = getOldProductPrice(product, undefined)?.price_formatted;
  return (
    <S.Root key={product.id}>
      <div>
        <S.Image $src={getProductMainImage(product)} />
      </div>
      <S.SecondColumn>
        <div>
          <div>{product.name}</div>
        </div>

        <div>
          <div>{newPrice ?? oldPrice}</div>
          <S.ButtonContainer>
            {cartItem ? (
              <Button filled={true}>В кошику</Button>
            ) : (
              <Button onClick={addToCart}>Додати в кошик</Button>
            )}
          </S.ButtonContainer>
        </div>
      </S.SecondColumn>
    </S.Root>
  );
};
