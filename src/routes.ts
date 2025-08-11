import { route, string, union } from "react-router-typesafe-routes/dom";

const PRODUCT_SORTER_MODES = [
  "default",
  "latest",
  "oldest",
  "price_low",
  "price_high",
] as const;

export const ROUTES = {
  INDEX: route(""),
  CATEGORY: route(
    "category",
    {},
    {
      WISHLIST: route("wishlist", {
        searchParams: {
          q: string(),
          sort: union(...PRODUCT_SORTER_MODES),
        },
      }),
      SHOW: route(":categorySlug", {
        searchParams: {
          q: string(),
          sort: union(...PRODUCT_SORTER_MODES),
        },
        params: {
          categorySlug: string(),
        },
      }),
    }
  ),
  THANKYOU: route("thankyou", {
    searchParams: {
      order_id: string(),
    },
  }),
  PUBLIC_OFFER: route("public-offer"),
  DELIVERYANDPAYMENT: route("dostavka-i-oplata"),
  CHECKOUT: route("checkout"),
  ACCOUNT: route(
    "account",
    {},
    {
      PROFILE: route(
        "profile",
        {},
        {
          EDIT: route("edit"),
        }
      ),
      PASSWORD_RECOVERY: route("recover-password"),
      SAVED_ADDRESSES: route("saved-addresses"),
      ORDER: route("orders"),
    }
  ),
  RESET_PASSWORD: route(
    "reset-password",
    {},
    {
      CODE: route(":code"),
    }
  ),
  REFUND: route("refund"),
  REFUND_EXT: route("refund-policy-ext"),
} as const;

export const LEAVE_REVIEW_LINK =
  "https://docs.google.com/forms/d/1MVNV7ISzmtkWybXZ9aHovUyk3Ptr0815ismN7d2k4Zw";
