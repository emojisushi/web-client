import { Header } from "../Header";
import { Footer } from "../Footer";
import * as S from "./styled";
import { useWindowScroll } from "react-use";
import {
  StickyToTopBtn,
  Sticky,
  TinyCartButton,
  CartModal,
  LocationsModal,
  RestaurantClosed,
  TelegramModal,
  ContactsModal,
  MobMenuModal,
  AuthModal,
} from "~components";
import { ReactNode, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { cartQuery } from "~domains/cart/cart.query";
import { PRODUCT_ID_SEARCH_QUERY_PARAM } from "~domains/product/products.query";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "~hooks/use-auth";
import { DefaultErrorBoundary } from "~components/DefaultErrorBoundary";
import { observer } from "mobx-react";
import { useAppStore } from "~stores/appStore";
import { citiesQuery } from "~domains/city/cities.query";
import { ModalIDEnum } from "~common/modal.constants";
import { isClosed } from "~utils/time.utils";
import { appConfig } from "~config/app";
import { useShowModal } from "~modal";
import { router } from "~router";
import { RouterSubscriber, RouterState } from "@remix-run/router";
import { RegisterModal } from "~components/modals/RegisterModal";
import { ResetPasswordModal } from "~components/modals/ResetPasswordModal";
import { ProductModal } from "~components/modals/ProductModal";
import { useCurrentCitySlug } from "~domains/city/hooks/useCurrentCitySlug";
import { SearchProductsModal } from "~components/modals/SearchProductsModal";
import { useCartTotals } from "~domains/cart/hooks/use-cart-totals";

export const Layout = observer(
  ({ children, ...rest }: { children?: ReactNode }) => {
    // todo: debounce it
    const { x, y } = useWindowScroll();
    const appStore = useAppStore();
    const showStickyCart = y > 100;

    const { isLoading: isCartLoading } = useQuery(cartQuery);
    const { data: user, isLoading: isUserLoading } = useUser();
    const showModal = useShowModal();

    const citySlug = useCurrentCitySlug();
    const { data: cities, isLoading: isCitiesLoading } = useQuery(citiesQuery);
    const city = (cities?.data || []).find((c) => c.slug === citySlug);
    const cartTotals = useCartTotals();

    useEffect(() => {
      const routerSubscriber: RouterSubscriber = (state: RouterState) => {
        if (state.navigation.location) {
          return;
        }
        const { location } = state;
        const searchParams = new URLSearchParams(location.search);

        if (searchParams.get(PRODUCT_ID_SEARCH_QUERY_PARAM)) {
          showModal(ModalIDEnum.ProductModal);
          return;
        }

        const closed = isClosed({
          start: appConfig.workingHours[0],
          end: appConfig.workingHours[1],
        });

        if (closed) {
          //if (process.env.NODE_ENV !== "development") {
          showModal(ModalIDEnum.RestaurantClosed);
          //}
        } else if (!appStore.userConfirmedLocation) {
          showModal(ModalIDEnum.LocationModal);
        }
      };
      // run immediately
      routerSubscriber(router.state, {
        unstable_flushSync: false,
        deletedFetchers: [],
      });

      return router.subscribe(routerSubscriber);
    }, []);

    return (
      <S.Layout {...rest}>
        {isCartLoading || isUserLoading || isCitiesLoading ? (
          <Header loading />
        ) : (
          <Header cities={cities.data} user={user} />
        )}
        <S.Main>
          <Outlet />
        </S.Main>
        <Footer city={city} loading={isCitiesLoading} />
        {!isCartLoading && (
          <Sticky top={"30px"} right={"30px"} show={showStickyCart}>
            <S.TinyCartButtonOverlay>
              <TinyCartButton
                onClick={() => {
                  showModal(ModalIDEnum.CartModal);
                }}
                price={cartTotals.total}
              />
            </S.TinyCartButtonOverlay>
          </Sticky>
        )}
        <LocationsModal id={ModalIDEnum.LocationModal} />
        <RestaurantClosed id={ModalIDEnum.RestaurantClosed} />
        <TelegramModal id={ModalIDEnum.TelegramModal} />
        <SearchProductsModal id={ModalIDEnum.SearchProductsModal} />
        <ContactsModal id={ModalIDEnum.ContactsModal} />
        <CartModal id={ModalIDEnum.CartModal} />
        <ProductModal id={ModalIDEnum.ProductModal} />

        <AuthModal id={ModalIDEnum.AuthModal} />
        <RegisterModal id={ModalIDEnum.RegisterModal} />
        <ResetPasswordModal id={ModalIDEnum.ResetPasswordModal} />
        <MobMenuModal id={ModalIDEnum.MobMenuModal} />
        <StickyToTopBtn />
      </S.Layout>
    );
  }
);

export const Component = Layout;

export const ErrorBoundary = DefaultErrorBoundary;

Object.assign(Component, {
  displayName: "LazyLayout",
});
