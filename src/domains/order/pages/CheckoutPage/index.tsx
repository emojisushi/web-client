import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Container, Heading } from "~components";
import { cartQuery } from "~domains/cart/cart.query";
import { ROUTES } from "~routes";
import { Page } from "~components/Page";
import { useUser } from "~hooks/use-auth";
import { DefaultErrorBoundary } from "~components/DefaultErrorBoundary";
import { CheckoutForm } from "src/domains/order/pages/CheckoutPage/components/CheckoutForm";
import { CheckoutCart } from "src/domains/order/pages/CheckoutPage/components/CheckoutCart";
import { useCurrentCitySlug } from "~domains/city/hooks/useCurrentCitySlug";
import { citiesQuery } from "~domains/city/cities.query";
import * as S from "./styled";
import { useShowBinotel } from "~hooks/use-binotel";
import { checkoutFormQuery } from "~domains/order/order.query";
import { catalogQuery } from "~domains/catalog/catalog.query";

const CheckoutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useShowBinotel();

  const { data: user, isLoading: isUserLoading } = useUser();

  const { data: cart, isLoading: isCartLoading } = useQuery({
    ...cartQuery,
    onSuccess: (res) => {
      if (res.items.length < 1) {
        navigate(ROUTES.CATEGORY.path);
      }
    },
  });

  const { isLoading: isLoadingCatalog } = useQuery({
    ...catalogQuery,
  });

  const { data: checkoutForm, isLoading: isCheckoutFormLoading } =
    useQuery(checkoutFormQuery);

  const citySlug = useCurrentCitySlug();
  const { data: cities, isLoading: isCitiesLoading } = useQuery(citiesQuery);
  const city = (cities?.data || []).find((c) => c.slug === citySlug);

  useEffect(() => {
    if (cart?.items && cart.items.length < 1) {
      navigate(ROUTES.CATEGORY.path);
    }
  }, [cart]);

  const renderCheckoutForm = () => {
    const loading =
      isCitiesLoading ||
      isCartLoading ||
      isLoadingCatalog ||
      isUserLoading ||
      isCheckoutFormLoading;

    if (loading) {
      return <CheckoutForm loading />;
    }

    return (
      <CheckoutForm
        // remount component after signin to update form
        key={user ? "one" : "second"}
        cart={cart}
        city={city}
        shippingMethods={checkoutForm.shipping_methods}
        paymentMethods={checkoutForm.payment_methods}
        user={user}
        spots={checkoutForm.spots}
      />
    );
  };

  const renderCheckoutCart = () => {
    if (isCartLoading || isLoadingCatalog) {
      return <CheckoutCart loading={true} />;
    }
    return <CheckoutCart cart={cart} />;
  };

  return (
    <Page>
      <Container>
        <Heading>{t("checkout.title")}</Heading>
        <S.Container>
          {renderCheckoutForm()}
          {renderCheckoutCart()}
        </S.Container>
      </Container>
    </Page>
  );
};

export const Component = CheckoutPage;

export const ErrorBoundary = DefaultErrorBoundary;

Object.assign(Component, {
  displayName: "LazyCheckoutPage",
});
