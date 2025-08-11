import * as S from "./styled";
import { SvgIcon } from "../SvgIcon";
import { FlexBox } from "../FlexBox";
import { CaretUpSvg } from "../svg/CaretUpSvg";
import { Collapsible } from "../Collapsible";
import { IOrder } from "@layerok/emojisushi-js-sdk";
import { LogoSvg } from "~components/svg/LogoSvg";
import { useTranslation } from "react-i18next";
import { getProductMainImage } from "~domains/product/product.utils";

export const AccordionItem = ({ order }: { order: IOrder }) => {
  const { t } = useTranslation();

  const renderContainer = ({ Header, Panel }) => {
    return (
      <S.Container>
        <Header />
        <Panel />
      </S.Container>
    );
  };
  const renderHeader = ({ opened }) => {
    return (
      <S.Header>
        <S.HeaderMobileTextContainer>
          <S.MutedText>№{order.order_number}</S.MutedText>
          <S.PanPropsPropValue>{order.updated_at}</S.PanPropsPropValue>
        </S.HeaderMobileTextContainer>
        <S.HeaderStatus
          style={{
            color: order.order_state.color,
          }}
        >
          {order.order_state.name}
        </S.HeaderStatus>
        <SvgIcon
          width={"20px"}
          style={{
            transformOrigin: "center",
            transform: opened ? "rotate(0deg)" : "rotate(180deg)",
          }}
          color={"#939393"}
        >
          <CaretUpSvg />
        </SvgIcon>
      </S.Header>
    );
  };
  const renderPanel = ({ opened }) => {
    return (
      <S.Pan>
        <S.PanProps>
          <S.PanPropsExceptStatus>
            <S.PanPropsProp>
              <S.PanPropsPropLabel>
                <S.MutedText>{t("common.paymentMethod")}</S.MutedText>
              </S.PanPropsPropLabel>
              <S.PanPropsPropValue>
                {order.payment.method.name}
              </S.PanPropsPropValue>
            </S.PanPropsProp>
            <S.PanPropsProp>
              <S.PanPropsPropLabel>
                <S.MutedText>{t("common.shippingMethod")}</S.MutedText>
              </S.PanPropsPropLabel>
              <S.PanPropsPropValue>
                {order.shipping.method.name}
              </S.PanPropsPropValue>
            </S.PanPropsProp>
            <S.PanPropsProp>
              <S.PanPropsPropLabel>
                <S.MutedText>{t("common.shippingAddress")}</S.MutedText>
              </S.PanPropsPropLabel>
              <S.PanPropsPropValue>
                {order.billing_address.lines}
              </S.PanPropsPropValue>
            </S.PanPropsProp>
          </S.PanPropsExceptStatus>
          <S.PanStatus>
            <S.PanStatusLabel>
              {t("account.orders.order.status")}
            </S.PanStatusLabel>
            <S.PanStatusValue
              style={{
                color: order.order_state.color,
              }}
            >
              {order.order_state.name}
            </S.PanStatusValue>
          </S.PanStatus>
        </S.PanProps>

        <div>
          {order.products.map((product, index) => {
            const mainImage = getProductMainImage(product.product);

            return (
              <S.PanProd key={product.id}>
                {mainImage ? (
                  <S.PanProdImg src={mainImage} />
                ) : (
                  <SvgIcon
                    color={"white"}
                    width={"80px"}
                    style={{ opacity: 0.05 }}
                  >
                    <LogoSvg />
                  </SvgIcon>
                )}

                <S.PanProdProps>
                  <S.PanProdSect1>
                    <S.PanProdName>{product.name}</S.PanProdName>

                    <S.PanProdDescription>
                      <S.PanProdProp>
                        {product.quantity} {t("common.pcs")}
                      </S.PanProdProp>
                      <S.PanVerticalStick />
                      <S.PanProdProp>{product.weight} г</S.PanProdProp>
                    </S.PanProdDescription>
                  </S.PanProdSect1>

                  <S.PanProdSect2>
                    <FlexBox flexDirection={"column"}>
                      <S.PanProdPrice>
                        {product.item.price[order.currency.code]}
                      </S.PanProdPrice>
                      <S.PanProdAmount>
                        {t("common.amount")}: {product.quantity}{" "}
                        {t("common.pcs")}
                      </S.PanProdAmount>
                    </FlexBox>
                    <div style={{ marginLeft: "39px" }}>
                      <S.PanProdPrice>
                        {product.item.price[order.currency.code]}
                      </S.PanProdPrice>
                    </div>
                  </S.PanProdSect2>
                </S.PanProdProps>
              </S.PanProd>
            );
          })}
        </div>

        <S.PanProdTotalPrice>
          <S.PanProdPrice>
            {t("common.to_pay")}: {order.total_post_taxes / 100}{" "}
            {order.currency.symbol}
          </S.PanProdPrice>
        </S.PanProdTotalPrice>
      </S.Pan>
    );
  };

  return (
    <Collapsible
      renderPanel={({ opened }) => {
        return renderPanel({ opened });
      }}
      renderHeader={({ opened }) => {
        return renderHeader({ opened });
      }}
      renderContainer={({ Header, Panel }) => {
        return renderContainer({ Header, Panel });
      }}
      headerTag={"div"}
    />
  );
};
