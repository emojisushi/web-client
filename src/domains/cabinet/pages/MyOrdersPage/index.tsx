import { useTranslation } from "react-i18next";
import { AccordionItem } from "~components";
import { useUser } from "~hooks/use-auth";

export const MyOrdersPage = () => {
  const { t } = useTranslation();
  const { data: user } = useUser();

  const orders = user.customer.orders;
  return (
    <div
      style={{
        marginTop: 20,
      }}
    >
      {!!orders.length ? (
        orders.map((order, index) => (
          <div
            style={{
              marginTop: index ? "16px" : 0,
            }}
          >
            <AccordionItem key={order.id} order={order} />
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
