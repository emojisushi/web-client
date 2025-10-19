import {
  Heading,
  SvgIcon,
  Container,
  SkeletonWrap,
  SpinnerSvg,
} from "~components";
import * as S from "./styled";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { Page } from "~components/Page";
import { useTypedSearchParams } from "react-router-typesafe-routes/dom";
import { ROUTES } from "~routes";
import { useQuery } from "@tanstack/react-query";
import { orderStatusQuery } from "~domains/order/orderStatus.query";
import { CancelSvg } from "~components/svg/CancelSvg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

enum OrderStatus {
  WAITING = 1,
  PAID = 2,
  PENDING = 3,
  EXPIRED = 4,
  CANCELLED = 5,
  REFUND = 6,
}

export const OrderStatusPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [{ order_id }] = useTypedSearchParams(ROUTES.ORDER_STATUS);
  const { data: order, failureCount } = useQuery({
    ...orderStatusQuery(order_id),
    refetchInterval: 5000,
  });
  let statusText;
  let svg;

  useEffect(() => {
    if (order?.status === OrderStatus.PAID) {
      navigate(
        `${ROUTES.THANKYOU.path}?order_id=${order.poster_id} (${order.online_payment_id})&online_order=true&location_confirmed=true`
      );
    }
  }, [order?.status, navigate]);

  switch (order?.status) {
    case OrderStatus.WAITING:
      statusText = t("orderStatus.waiting.text");
      svg = <SpinnerSvg />;
      break;
    case OrderStatus.PENDING:
      statusText = t("orderStatus.pending.text");
      svg = <SpinnerSvg />;
      break;
    case OrderStatus.CANCELLED:
      statusText = t("orderStatus.cancelled.text");
      svg = <CancelSvg />;
      break;
    case OrderStatus.EXPIRED:
      statusText = t("orderStatus.expired.text");
      svg = <CancelSvg />;
      break;
    default:
      break;
  }

  const theme = useTheme();
  return (
    <Page>
      <Container>
        <S.Center>
          {failureCount > 2 ? (
            <Heading
              style={{
                marginBottom: "20px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {t("orderStatus.notFound")}
            </Heading>
          ) : (
            <SkeletonWrap loading={order == null}>
              <Heading
                style={{
                  marginBottom: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {t("orderStatus.title", { id: order_id })}
              </Heading>
              <SvgIcon color={theme.colors.brand} style={{ width: "60px" }}>
                {svg}
              </SvgIcon>
              <S.Text>{statusText}</S.Text>
            </SkeletonWrap>
          )}
        </S.Center>
      </Container>
    </Page>
  );
};

export const Component = OrderStatusPage;

Object.assign(Component, {
  displayName: "LazyOrderStatusPage",
});
