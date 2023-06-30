import { Container, Heading } from "~components";
import { CheckoutForm, CheckoutCart } from "./components";
import { useTranslation } from "react-i18next";
import { cartQuery, paymentQuery, shippingQuery } from "~queries";
import * as S from "./styled";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "~hooks/use-auth";
import { useNavigate, useParams } from "react-router-dom";

const CheckoutPage = () => {
  const { t } = useTranslation();

  const { data: user, isLoading: isUserLoading } = useUser();

  const { data: cart, isLoading: isCartLoading } = useQuery({
    ...cartQuery,
    onSuccess: (res) => {
      if (res.data.length < 1) {
        navigate("/" + [lang, citySlug, spotSlug].join("/"));
      }
    },
  });
  const { data: shippingMethods, isLoading: isShippingMethodsLoading } =
    useQuery(shippingQuery);
  const { data: paymentMethods, isLoading: isPaymentMethodsLoading } =
    useQuery(paymentQuery);

  const { lang, citySlug, spotSlug } = useParams();
  const navigate = useNavigate();

  return (
    <Container>
      <Heading>{t("checkout.title")}</Heading>
      <S.Container>
        {isCartLoading ||
        isUserLoading ||
        isShippingMethodsLoading ||
        isPaymentMethodsLoading ? (
          <CheckoutForm loading />
        ) : (
          <CheckoutForm
            // remount component after signin to update form
            key={user ? "one" : "second"}
            cart={cart}
            shippingMethods={shippingMethods}
            paymentMethods={paymentMethods}
            user={user}
          />
        )}

        {isCartLoading ? (
          <CheckoutCart loading={true} />
        ) : (
          <CheckoutCart
            cart={cart}
            onEmpty={() => {
              navigate("/" + [lang, citySlug, spotSlug].join("/"));
            }}
          />
        )}
      </S.Container>
    </Container>
  );
};

export const Component = CheckoutPage;

Object.assign(Component, {
  displayName: "LazyCheckoutPage",
});
