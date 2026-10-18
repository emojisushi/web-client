import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { orderHistoryQuery } from "~domains/order/orderHistory.query";
import { OrderHistoryItem } from "./components/OrderHistoryItem";

export const MyOrdersPage = () => {
  const { t } = useTranslation();

  const { data: orders, isLoading } = useQuery({
    ...orderHistoryQuery,
    staleTime: 0,
  });

  if (isLoading) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: 20,
      }}
    >
      {!!orders?.length ? (
        orders.map((order, index) => (
          <div
            key={order.transaction_id}
            style={{
              marginTop: index ? "16px" : 0,
            }}
          >
            <OrderHistoryItem order={order} />
          </div>
        ))
      ) : (
        <p>{t("account.orders.noOrders")}</p>
      )}
    </div>
  );
};

export const Component = MyOrdersPage;
Object.assign(Component, {
  displayName: "LazyMyOrdersPage",
});
