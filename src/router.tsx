import { Trans } from "react-i18next";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { DefaultErrorBoundary } from "~components/DefaultErrorBoundary";
import { ROUTES } from "~routes";
import { lazy } from "~lazy";

const routes = [
  {
    path: ROUTES.INDEX.path,
    id: "root",
    lazy: lazy(() => import("src/pages/RootPage/RootPage")),
    children: [
      {
        index: true,
        lazy: lazy(() => import("~pages/RootIndexPage/RootIndexPage")),
      },
      {
        id: "layout",
        lazy: lazy(() => import("~layout/Layout")),
        children: [
          {
            element: <Outlet />,
            ErrorBoundary: DefaultErrorBoundary,
            children: [
              {
                path: ROUTES.PUBLIC_OFFER.path,
                lazy: lazy(
                  () => import("~pages/PublicOfferPage/PublicOfferPage")
                ),
              },
              {
                path: ROUTES.CATEGORY.path,
                id: "categories",
                children: [
                  {
                    index: true,
                    lazy: lazy(
                      () => import("~domains/category/pages/SelectCategoryPage")
                    ),
                  },
                  {
                    lazy: lazy(() => import("~layout/MenuLayout/MenuLayout")),
                    children: [
                      {
                        path: ROUTES.CATEGORY.WISHLIST.path,
                        lazy: lazy(
                          () => import("~domains/wishlist/pages/WishlistPage")
                        ),
                        id: "wishlist",
                      },
                      {
                        path: ROUTES.CATEGORY.SHOW.path,
                        lazy: lazy(
                          () => import("~domains/product/pages/ProductPage")
                        ),
                        id: "category",
                      },
                    ],
                  },
                ],
              },
              {
                path: ROUTES.THANKYOU.path,
                lazy: lazy(() => import("~domains/order/pages/ThankYouPage")),
              },
              {
                path: ROUTES.DELIVERYANDPAYMENT.path,
                lazy: lazy(() => import("~domains/spot/pages/DeliveryPage")),
              },
              {
                path: ROUTES.CHECKOUT.path,
                lazy: lazy(() => import("~domains/order/pages/CheckoutPage")),
              },
              {
                path: ROUTES.ACCOUNT.path,
                lazy: lazy(() => import("~layout/CabinetLayout")),
                children: [
                  {
                    index: true,
                    element: <Navigate to={ROUTES.ACCOUNT.PROFILE.path} />,
                  },
                  {
                    path: ROUTES.ACCOUNT.PROFILE.path,
                    children: [
                      {
                        index: true,
                        lazy: lazy(
                          () => import("~domains/cabinet/pages/ProfilePage")
                        ),
                        handle: {
                          title: () => (
                            <Trans i18nKey={"account.profile.title"} />
                          ),
                        },
                      },
                      {
                        path: ROUTES.ACCOUNT.PROFILE.EDIT.path,
                        lazy: lazy(
                          () => import("~domains/cabinet/pages/EditProfilePage")
                        ),
                        handle: {
                          title: () => (
                            <Trans i18nKey={"account.edit-profile.title"} />
                          ),
                        },
                      },
                    ],
                  },
                  {
                    path: ROUTES.ACCOUNT.PASSWORD_RECOVERY.path,
                    lazy: lazy(
                      () => import("~domains/cabinet/pages/UpdatePasswordPage")
                    ),
                    handle: {
                      title: () => (
                        <Trans i18nKey={"account.changePassword.title"} />
                      ),
                    },
                  },
                  {
                    path: ROUTES.ACCOUNT.SAVED_ADDRESSES.path,
                    lazy: lazy(
                      () => import("~domains/cabinet/pages/SavedAddressesPage")
                    ),
                    handle: {
                      title: () => (
                        <Trans i18nKey={"account.addresses.title"} />
                      ),
                    },
                  },
                  {
                    path: ROUTES.ACCOUNT.ORDER.path,
                    lazy: lazy(
                      () => import("~domains/cabinet/pages/MyOrdersPage")
                    ),
                    handle: {
                      title: () => <Trans i18nKey={"account.orders.title"} />,
                    },
                  },
                ],
              },

              {
                path: ROUTES.RESET_PASSWORD.path,
                children: [
                  {
                    index: true,
                    lazy: lazy(
                      () => import("~domains/cabinet/pages/ResetPasswordPage")
                    ),
                  },
                  {
                    path: ROUTES.RESET_PASSWORD.CODE.path,
                    lazy: lazy(
                      () => import("~domains/cabinet/pages/ResetPasswordPage")
                    ),
                  },
                ],
              },
              {
                path: ROUTES.REFUND.path,
                lazy: lazy(() => import("~domains/payment/pages/RefundPage")),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: ROUTES.REFUND_EXT.path,
    lazy: lazy(() => import("~domains/payment/pages/RefundPageExt")),
  },
  {
    path: "*",
    element: <Navigate to={ROUTES.INDEX.path} />,
  },
];

export const router = createBrowserRouter(routes);
