import * as S from "~components/AccordionItem/styled";
import { SvgIcon, SkeletonWrap } from "~components";
import { CaretUpSvg } from "~components/svg/CaretUpSvg";
import { LogoSvg } from "~components/svg/LogoSvg";
import { Collapsible } from "~components/Collapsible";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { IOrderHistoryItem } from "@layerok/emojisushi-js-sdk";
import { orderHistoryItemQuery } from "~domains/order/orderHistory.query";
import { catalogQuery } from "~domains/catalog/catalog.query";
import { getProductMainImage } from "~domains/product/product.utils";

const OrderHistoryDetail = ({ order }: { order: IOrderHistoryItem }) => {
  const { t } = useTranslation();

  const { data: orderData, isLoading } = useQuery({
    ...orderHistoryItemQuery(order.transaction_id + ""),
    retry: 1,
  });

  const { data: catalogData } = useQuery(catalogQuery);

  if (isLoading) {
    return (
      <S.Pan>
        <SkeletonWrap loading={true}>
          <div style={{ height: 60 }} />
        </SkeletonWrap>
      </S.Pan>
    );
  }

  const data = orderData ?? order;

  const items = (data.products || []).map((item) => {
    const product = (catalogData?.products || []).find(
      (p) => p.id === item.product_id
    );
    const quantity = Number(item.num || 0);
    const price = Number(item.product_sum || 0) / 100 / (quantity || 1);

    return {
      id: item.product_id,
      image: product ? getProductMainImage(product) : undefined,
      name: product?.name ?? item.name ?? t("account.orders.unknownProduct"),
      quantity,
      price,
    };
  });

  return (
    <S.Pan>
      {!!data.address && (
        <S.PanProps>
          <S.PanPropsExceptStatus>
            <S.PanPropsProp>
              <S.PanPropsPropLabel>
                <S.MutedText>{t("account.orders.address")}</S.MutedText>
              </S.PanPropsPropLabel>
              <S.PanPropsPropValue>{data.address}</S.PanPropsPropValue>
            </S.PanPropsProp>
          </S.PanPropsExceptStatus>
        </S.PanProps>
      )}

      {items.map((item, index) => (
        <S.PanProd key={item.id ?? index}>
          {item.image ? (
            <S.PanProdImg src={item.image} />
          ) : (
            <SvgIcon color={"white"} width={"80px"} style={{ opacity: 0.05 }}>
              <LogoSvg />
            </SvgIcon>
          )}
          <S.PanProdSect1>
            <S.PanProdName>{item.name}</S.PanProdName>
            <S.PanProdDescription>
              <S.PanProdSect2>
                <S.PanProdAmount>
                  {t("account.orders.pricePerItem")}
                </S.PanProdAmount>
                <S.PanProdPrice>{item.price.toFixed(2)} ₴</S.PanProdPrice>
              </S.PanProdSect2>
              <S.PanVerticalStick />
              <S.PanProdSect2>
                <S.PanProdAmount>
                  {t("account.orders.itemsTotal", { qty: item.quantity })}
                </S.PanProdAmount>
                <S.PanProdPrice>
                  {(item.price * item.quantity).toFixed(2)} ₴
                </S.PanProdPrice>
              </S.PanProdSect2>
            </S.PanProdDescription>
          </S.PanProdSect1>
        </S.PanProd>
      ))}

      {!!data.delivery_price && (
        <S.PanPropsProp style={{ marginTop: "10px" }}>
          <S.PanPropsPropLabel>
            <S.MutedText>{t("account.orders.deliveryPrice")}</S.MutedText>
          </S.PanPropsPropLabel>
          <S.PanPropsPropValue>
            {(data.delivery_price / 100).toFixed(2)} ₴
          </S.PanPropsPropValue>
        </S.PanPropsProp>
      )}

      <S.PanProdTotalPrice>
        <S.PanPropsPropLabel style={{ width: "auto" }}>
          <S.MutedText>{t("account.orders.orderTotal")}</S.MutedText>
        </S.PanPropsPropLabel>
        <S.PanStatusValue style={{ marginLeft: "10px" }}>
          {(data.sum / 100).toFixed(2)} ₴
        </S.PanStatusValue>
      </S.PanProdTotalPrice>
    </S.Pan>
  );
};

export const OrderHistoryItem = ({ order }: { order: IOrderHistoryItem }) => {
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
          <S.MutedText>№{order.transaction_id}</S.MutedText>
          <S.PanPropsPropValue>
            {new Date(Number(order.date_start_new)).toLocaleString("uk-UA")}
          </S.PanPropsPropValue>
        </S.HeaderMobileTextContainer>
        <S.HeaderStatus>{t("account.orders.completed")}</S.HeaderStatus>
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

  const renderPanel = ({ opened }: { opened: boolean }) => {
    return opened && <OrderHistoryDetail order={order} />;
  };

  return (
    <Collapsible
      renderContainer={renderContainer}
      renderHeader={renderHeader}
      renderPanel={renderPanel}
    />
  );
};
