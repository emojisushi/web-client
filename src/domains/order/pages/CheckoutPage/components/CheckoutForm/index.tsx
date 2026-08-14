import {
  FlexBox,
  Input,
  SegmentedControl,
  Dropdown,
  SkeletonWrap,
  Trans,
  Checkbox,
} from "~components";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import * as S from "./styled";
import {
  ICity,
  IDistrict,
  IPaymentMethod,
  IProduct,
  IShippingMethod,
  ISpot,
  IUser,
  PaymentMethodCodeEnum,
  ShippingMethodCodeEnum,
} from "@layerok/emojisushi-js-sdk";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Cart } from "~domains/cart/cart.query";
import axios, { AxiosError } from "axios";
import { observer } from "mobx-react";
import { ModalIDEnum } from "~common/modal.constants";
import { ROUTES } from "~routes";
import { isValidUkrainianPhone, getUserFullName } from "~domains/order/utils";
import { useShowModal } from "~modal";
import { Button } from "~common/ui-components/Button/Button";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "~utils/ls.utils";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";
import { unformat, useMask, format } from "@react-input/mask";
import { composeRefs } from "~utils/ref";
import { Autocomplete } from "~components/Autocomplete";
import { addressQuery } from "~domains/order/address.query";
import { useQuery } from "@tanstack/react-query";
import { isClosed } from "~utils/time.utils";
import { appConfig } from "~config/app";
import { useSmsVerification } from "~hooks/useSmsVerification";
import { CheckoutRecommended } from "../CheckoutRecommended";

type TCheckoutFormProps = {
  loading?: boolean | undefined;
  user?: IUser | undefined;
  cart?: Cart | undefined;
  shippingMethods?: IShippingMethod[] | undefined;
  paymentMethods?: IPaymentMethod[] | undefined;
  spots?: ISpot[];
  city?: ICity;
  addressAutocomplete?: boolean;
  onRedirectToThankYouPage?: () => void;
  unavailableCategories?: number[] | undefined;
  setUnavailableCategories?: Dispatch<SetStateAction<number[]>> | undefined;
  unavailableProducts?: number[] | undefined;
  setUnavailableProducts?: Dispatch<SetStateAction<number[]>> | undefined;
};

// todo: mark optional fields instead of marking required fields

enum FormNames {
  SpotId = "spot_id",
  DistrictId = "district_id",
  ShippingMethodCode = "shipping_method_code",
  PaymentMethodCode = "payment_method_code",
  HouseType = "house_type",
  Change = "change",
  Street = "street",
  House = "house",
  Apartment = "apartment",
  Entrance = "entrance",
  Floor = "floor",
  Name = "name",
  Phone = "phone",
  Sticks = "sticks",
  Comment = "comment",
  DontCall = "dont_call",
}

const fieldSortOrderMap: Record<keyof FormValues, number> = {
  shipping_method_code: 1,
  spot_id: 2,
  district_id: 2,
  house_type: 3,
  street: 4,
  house: 5,
  apartment: 6,
  entrance: 7,
  floor: 8,
  name: 9,
  phone: 10,
  sticks: 11,
  comment: 12,
  payment_method_code: 13,
  change: 14,
  dont_call: 15,
};

const localStorageKeys = {
  draftOrder: {
    name: "draftOrder",
    version: "1",
  },
};

enum HouseType {
  PrivateHouse = "private_house",
  HighRiseBuilding = "high_rise_building",
}

const first = (array) => {
  return array[0];
};

type FormValues = {
  name: string;
  phone: string;
  street: number | string;
  house: string;
  apartment: string;
  entrance: string;
  floor: string;
  comment: string;
  sticks: string;
  change: string;
  payment_method_code: PaymentMethodCodeEnum;
  shipping_method_code: ShippingMethodCodeEnum;
  house_type: HouseType;
  spot_id: number | undefined;
  district_id: number | undefined;
  dont_call: boolean;
};

type ErrorResponse = {
  errors?: {
    firstname: string[];
    lastname: string[];
    phone: string[];
    email: string[];
    shipping_method_id: string[];
    payment_method_id: string[];
    spot_id: string[];
    address: string[];
  };
  message: string;
};

const phoneMaskOptions = {
  mask: "+38(___) ___-__-__",
  replacement: { _: /\d/ },
  showMask: true,
  track: ({ inputType, data }) => {
    if (inputType === "insert") {
      if (data.startsWith("+38")) {
        data = data.slice(3);
      }
    }
    return data;
  },
};

export const CheckoutForm = observer(
  ({
    cart,
    shippingMethods,
    paymentMethods,
    user,
    city,
    spots: spotsRes,
    loading = false,
    addressAutocomplete = false,
    onRedirectToThankYouPage,
    unavailableCategories,
    setUnavailableCategories,
    unavailableProducts,
    setUnavailableProducts,
  }: TCheckoutFormProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [recommendedProducts, setRecommendedProducts] = useState<IProduct[]>(
      []
    );

    const showModal = useShowModal();
    const phoneInputRef = useMask(phoneMaskOptions);
    const { data: addresses, isLoading: _isAddressLoading } = useQuery({
      ...addressQuery(city?.slug),
      enabled: !!addressAutocomplete,
    });
    const isAddressLoading = addressAutocomplete ? _isAddressLoading : false;
    const TakeAwaySchema = Yup.object().shape({
      phone: Yup.string()
        // todo: show more user friendly validation errors
        .required(t("validation.required"))
        .test(
          "is-possible-phone-number",
          () => t("checkout.form.validation.phone.uk_format"),
          isValidUkrainianPhone
        ),
      spot_id: Yup.number().required(t("validation.required")),
    });

    const CourierSchema = Yup.object().shape({
      phone: Yup.string()
        .required(t("validation.required"))
        .test(
          "is-possible-phone-number",
          () => t("checkout.form.validation.phone.uk_format"),
          isValidUkrainianPhone
        ),
      street: Yup.string().nullable().required(t("validation.required")),
      house: Yup.string().required(t("validation.required")),
      district_id: Yup.number().required(t("validation.required")),
    });

    const CourierSchemaHighRiseBuilding = Yup.object().shape({
      phone: Yup.string()
        .required(t("validation.required"))
        .test(
          "is-possible-phone-number",
          () => t("checkout.form.validation.phone.uk_format"),
          isValidUkrainianPhone
        ),
      street: Yup.string().nullable().required(t("validation.required")),
      house: Yup.string().required(t("validation.required")),
      apartment: Yup.string().required(t("validation.required")),
      entrance: Yup.string().required(t("validation.required")),
      floor: Yup.number().required(t("validation.required")),
      district_id: Yup.number().required(t("validation.required")),
    });
    const getValidationSchema = (values: FormValues) => {
      if (
        values.house_type === HouseType.HighRiseBuilding &&
        values.shipping_method_code === ShippingMethodCodeEnum.Courier
      ) {
        return CourierSchemaHighRiseBuilding;
      }
      if (values.shipping_method_code === ShippingMethodCodeEnum.Courier) {
        return CourierSchema;
      }

      return TakeAwaySchema;
    };

    const wayforpayFormContainer = useRef(null);

    const spots = (city?.spots || []).map((spot) => ({
      label: spot.name,
      value: spot.id,
      disabledText: t("checkout.temporarilyUnavailable"),
      disabled: !user?.is_call_center_admin && spot.temporarily_unavailable,
    }));
    const districts = (city?.districts || []).map((district) => ({
      label: district.name,
      value: district.id,
      disabledText: t("checkout.temporarilyUnavailable"),
      disabled:
        !user?.is_call_center_admin && district.spot.temporarily_unavailable,
    }));
    const [smsError, setSmsError] = useState<string>("");

    const initialValues: FormValues = {
      name: user && !user.is_call_center_admin ? getUserFullName(user) : "",
      //   phone: user && !user.is_call_center_admin ? user.phone || "+38" : "+38",
      street: "",
      house: "",
      apartment: "",
      entrance: "",
      floor: "",
      comment: "",
      sticks: "",
      change: "",
      payment_method_code: PaymentMethodCodeEnum.Cash,
      shipping_method_code: ShippingMethodCodeEnum.Takeaway,
      house_type: HouseType.PrivateHouse,
      // if only one spot or district is available, then choose it by default
      spot_id: spots.length === 1 ? spots[0].value : undefined,
      district_id:
        districts.length === 1 || addressAutocomplete
          ? districts[0].value
          : undefined,
      dont_call: false,
      ...(getFromLocalStorage(localStorageKeys.draftOrder) || {}),
    };
    const fieldsRef = useRef<Record<keyof FormValues, HTMLElement | null>>({
      phone: null,
      street: null,
      house: null,
      apartment: null,
      entrance: null,
      floor: null,
      district_id: null,
      name: null,
      spot_id: null,
      sticks: null,
      change: null,
      payment_method_code: null,
      house_type: null,
      shipping_method_code: null,
      comment: null,
      dont_call: null,
    });
    const handleSubmit = async (values: typeof initialValues) => {
      formik.setErrors({});
      if (addressAutocomplete && !selectedAddress?.spotName) {
        formik.setFieldError("street", "Ваша адреса не обслуговується");
      }
      if (isOnlinePaymentMethod && !phoneConfirmed) {
        setSmsError(t("phone.confirm"));
        return;
      }

      const {
        phone,
        name,
        payment_method_code,
        shipping_method_code,
        change,
        comment,
        sticks,
        spot_id,
        district_id,
        street,
        house,
        apartment,
        entrance,
        floor,
      } = values;

      const [firstname, lastname] = name.split(" ");
      let address;
      let addressDetails;
      if (addressAutocomplete) {
        address = street;
        addressDetails = [
          ["Будинок", house],
          ["Квартира", apartment],
          ["Під'їзд", entrance],
          ["Поверх", floor],
        ]
          .filter(([label, value]) => !!value)
          .map(([label, value]) => `${label}: ${value}`)
          .join(", ");
      } else {
        address = [
          ["Вулиця", street],
          ["Будинок", house],
          ["Квартира", apartment],
          ["Під'їзд", entrance],
          ["Поверх", floor],
        ]
          .filter(([label, value]) => !!value)
          .map(([label, value]) => `${label}: ${value}`)
          .join(", ");
      }
      const district = city?.districts.find(
        (district) => district.id === district_id
      );
      const resultant_spot_id = isTakeawayShipmentMethod
        ? spot_id
        : district.spot.id;

      const paymentMethod = paymentMethods.find(
        (method) => method.code === payment_method_code
      );
      const shippingMethod = shippingMethods.find(
        (method) => method.code === shipping_method_code
      );
      let _comment = comment;
      if (isOnlinePaymentMethod && formik.values[FormNames.DontCall]) {
        _comment = "Не передзвонювати " + comment;
      }
      try {
        const res = await EmojisushiAgent.placeOrderV2({
          phone: unformat(phone, phoneMaskOptions),
          firstname,
          lastname,
          email: user ? user.email : "",

          address,
          address_details: addressDetails,
          payment_method_id: paymentMethod.id,
          shipping_method_id: shippingMethod.id,
          spot_id: resultant_spot_id,
          house_type: values.house_type,
          house: values.house,
          floor: values.floor,
          apartment: values.apartment,
          entrance: values.entrance,

          change,
          sticks: +sticks,
          comment: _comment,
          cart: {
            items: cart.items.map((item) => ({
              id: item.product.id + "",
              variant_id: item.variant ? item.variant.id + "" : undefined,
              quantity: item.quantity,
            })),
          },
        });
        removeFromLocalStorage(localStorageKeys.draftOrder);
        if (res.data?.form) {
          wayforpayFormContainer.current.innerHTML = res.data.form;
          //   onRedirectToThankYouPage();
          wayforpayFormContainer.current.querySelector("form").submit();
        } else {
          const order_id = res.data?.poster_order?.incoming_order_id;

          navigate(
            ROUTES.THANKYOU.buildPath(
              {},
              {
                order_id: !!order_id ? `${order_id}` : "",
                wait_time: currentWaitTime,
              }
            )
          );
          onRedirectToThankYouPage();
        }
      } catch (e) {
        if (!axios.isAxiosError(e)) {
          return;
        }
        const { data } = (e as AxiosError<ErrorResponse>).response;

        const errors = data?.errors;
        const message = data?.message;
        if (!errors) {
          return;
        }

        if (errors.firstname) {
          formik.setFieldError(FormNames.Name, errors.firstname[0]);
        }

        if (message.includes("phone")) {
          formik.setFieldError(FormNames.Phone, "Недійсний номер телефону");
        }

        if (message.includes("адрес")) {
          formik.setFieldError(
            FormNames.Street,
            "Обраний заклад або адрес доставки тимчасово недоступні"
          );
          formik.setFieldError(
            FormNames.SpotId,
            "Обраний заклад або адрес доставки тимчасово недоступні"
          );
          fieldsRef.current.street?.scrollIntoView({
            behavior: "smooth",
          });
        }
        // todo: handle other server errors
        // todo: there can be more errors than just firstname
      }
    };

    const [validationSchema, setValidationSchema] = useState<
      | typeof TakeAwaySchema
      | typeof CourierSchema
      | typeof CourierSchemaHighRiseBuilding
    >(getValidationSchema(initialValues));

    const formik = useFormik<typeof initialValues>({
      initialValues,
      validateOnBlur: true,
      validateOnChange: true,
      validationSchema,
      onSubmit: handleSubmit,
    });

    useEffect(
      () => {
        if (formik.isSubmitting) {
          return;
        }
        const scrollToError = first(
          Object.keys(formik.errors).sort(
            (a, b) => fieldSortOrderMap[a] - fieldSortOrderMap[b]
          )
        );
        if (scrollToError) {
          fieldsRef.current[scrollToError]?.scrollIntoView({
            behavior: "smooth",
          });
        }
      },
      // formik.errors is omitted in dependency array on purpose
      // we don't want to scroll to a field with an error everytime formik.errors changes
      // we do want to scroll only when the form is submitted
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [formik.isSubmitting, fieldsRef]
    );

    const handleChange = (e: ChangeEvent<any>) => {
      setToLocalStorage(localStorageKeys.draftOrder, {
        ...formik.values,
        [e.currentTarget.name]: e.currentTarget.value,
      });
      formik.handleChange(e);
    };

    const setFieldValue = (name: string, value: any) => {
      setToLocalStorage(localStorageKeys.draftOrder, {
        ...formik.values,
        ...initialValues,
        [name]: value,
      });
      formik.setFieldValue(name, value);
    };
    const shippingMethodOptions = (shippingMethods || []).map((item) => ({
      value: item.code,
      // todo: don't use dynamic translation keys
      label: t("shippingMethods." + item.code, item.name),
    }));

    const paymentMethodOptions = (paymentMethods || []).map((item) => ({
      value: item.code,
      // todo: refactor dynamic translations
      label: t("paymentMethods." + item.code, item.name),
    }));

    const openLoginModal = () => {
      showModal(ModalIDEnum.AuthModal, {
        redirect_to: location.pathname,
      });
    };

    const handleShippingMethodChange = (e: ChangeEvent<HTMLInputElement>) => {
      handleChange(e);
      formik.setErrors({});
      formik.setTouched({});

      setValidationSchema(
        getValidationSchema({
          ...formik.values,
          [e.currentTarget.name]: e.currentTarget.value,
        })
      );
    };

    const handleHouseTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
      handleChange(e);
      formik.setErrors({});
      formik.setTouched({});
      setValidationSchema(
        getValidationSchema({
          ...formik.values,
          [e.currentTarget.name]: e.currentTarget.value,
        })
      );
    };

    const isTakeawayShipmentMethod =
      formik.values.shipping_method_code === ShippingMethodCodeEnum.Takeaway;

    const isCourierShipmentMethod =
      formik.values.shipping_method_code === ShippingMethodCodeEnum.Courier;

    const isCashPaymentMethod =
      formik.values.payment_method_code === PaymentMethodCodeEnum.Cash;

    const isOnlinePaymentMethod =
      formik.values.payment_method_code === PaymentMethodCodeEnum.Wayforpay;

    let filteredPaymentMethods = paymentMethodOptions;

    if (isTakeawayShipmentMethod) {
      filteredPaymentMethods = paymentMethodOptions.filter(
        (option) => option.value !== "wayforpay"
      );
    }

    const onlinePaymentClosed = isClosed({
      start: appConfig.onlinePaymentHours[0],
      end: appConfig.onlinePaymentHours[1],
    });

    if (onlinePaymentClosed) {
      filteredPaymentMethods = paymentMethodOptions.filter(
        (option) => option.value !== "wayforpay"
      );
    }
    useEffect(() => {
      if (
        !filteredPaymentMethods.find(
          (el) => el.value === formik.values.payment_method_code
        ) &&
        formik.values.payment_method_code !== PaymentMethodCodeEnum.Cash
      ) {
        formik.setFieldValue(
          FormNames.PaymentMethodCode,
          PaymentMethodCodeEnum.Cash
        );
      }
    }, [
      isTakeawayShipmentMethod,
      isOnlinePaymentMethod,
      onlinePaymentClosed,
      formik.values.payment_method_code,
    ]);
    const houseTypes = [
      {
        value: HouseType.PrivateHouse,
        label: t("checkout.form.privateHouse"),
      },
      {
        value: HouseType.HighRiseBuilding,
        label: t("checkout.form.highRiseBuilding"),
      },
    ];
    const addressesMemo = useMemo(() => {
      if (!addresses?.addresses) return [];
      return addresses.addresses.map((el) => ({
        id: el.id,
        name: `${el.name_ua}, ${el.suburb_ua}`,
        searchText:
          el.name_ua == el.name_ru
            ? `${el.name_ua} ${el.suburb_ua}`
            : `${el.name_ua} ${el.name_ru} ${el.suburb_ua}`,
        spotName: el.spot_name,
        min_amount: el.min_amount,
        delivery_price: el.delivery_price,
        min: el.min,
        unavailable_categories: el.unavailable_categories,
        unavailable_products: el.unavailable_products,
        recommended_products: el.recommended_products,
        wait_minutes: el.wait_minutes_delivery,
      }));
    }, [addresses?.addresses]);
    const setFieldRef =
      (name: keyof FormValues) => (node: HTMLElement | null) =>
        (fieldsRef.current[name] = node);
    const style80 = useMemo(() => ({ width: "80%" }), []);
    const setFieldValueCallback = useCallback((value) => {
      setFieldValue(FormNames.Street, value);
    }, []);

    let selectedAddress = addressesMemo.find(
      (el) => el.id === formik.values[FormNames.Street]
    );
    useEffect(() => {
      if (!addresses?.addresses || !selectedAddress?.name) return;

      const houseNumber = formik.values[FormNames.House];
      if (!houseNumber) return;

      const matchingAddresses = addresses.addresses.filter(
        (addr) => `${addr.name_ua}, ${addr.suburb_ua}` === selectedAddress.name
      );
      if (matchingAddresses.length === 0) return;

      const matchedAddress = matchingAddresses?.find((addr) =>
        addr.buildings?.some(
          (b) => b.toLowerCase().trim() === houseNumber.toLowerCase().trim()
        )
      );

      const defaultAddress =
        matchingAddresses?.find((addr) => addr.buildings.length === 0) ??
        matchingAddresses[0];
      if (matchedAddress) {
        setFieldValue(FormNames.Street, matchedAddress.id);
      } else {
        setFieldValue(FormNames.Street, defaultAddress.id);
      }
    }, [selectedAddress, formik.values[FormNames.House], addresses]);

    let deliveryFee = 0;
    let cartTotal = Number(cart?.total.replace("грн.", ""));
    let total = cartTotal;
    if (isCourierShipmentMethod && cartTotal < selectedAddress?.min_amount) {
      deliveryFee = selectedAddress?.delivery_price;
      total += deliveryFee;
    }
    const unavailableItems = cart?.items
      .filter(
        (item) =>
          unavailableProducts.includes(item.product.id) ||
          item.product.categories.some((cat) =>
            unavailableCategories.includes(cat.id)
          )
      )
      .map((item) => item.product.name);

    const {
      phoneConfirmed,
      smsSent,
      smsCode,
      setSmsCode,
      smsVerified,
      error,
      setError,
      sendSms,
      verifySms,
      sendSmsLoading,
      verifySmsLoading,
      isPhoneStatusLoading,
      smsCooldown,
      isCheckCodeButtonDisabled,
    } = useSmsVerification({
      phone: formik.values[FormNames.Phone] ?? "",
      city_slug: city?.slug,
    });

    let currentSpot = spotsRes?.find((el) => el.id === formik.values.spot_id);
    let currentWaitTime = isTakeawayShipmentMethod
      ? currentSpot?.wait_minutes_spot
      : selectedAddress?.wait_minutes;

    useEffect(() => {
      if (loading) return;
      const { spot_id, shipping_method_code, street } = formik.values;
      if (shipping_method_code === ShippingMethodCodeEnum.Takeaway) {
        const spot = currentSpot;
        setUnavailableCategories(
          spot?.unavailable_categories?.map((el) => el.id) ?? []
        );
        setUnavailableProducts(spot?.unavailable_products ?? []);
        setRecommendedProducts(spot?.recommended_products ?? []);
      } else {
        const address = selectedAddress;
        setUnavailableCategories(address?.unavailable_categories ?? []);
        setUnavailableProducts(address?.unavailable_products ?? []);
        const all = spotsRes.map((el) => el.recommended_products).flat();
        const seen = new Set();
        const filtered = all.filter((el) => {
          if (seen.has(el.id)) return false;
          seen.add(el.id);
          return address?.recommended_products.includes(el.id);
        });
        setRecommendedProducts(filtered ?? []);
      }
    }, [
      loading,
      formik.values[FormNames.SpotId],
      formik.values[FormNames.ShippingMethodCode],
      formik.values[FormNames.Street],
      spotsRes,
      selectedAddress,
      setUnavailableCategories,
      setUnavailableProducts,
    ]);

    const formatMinutes = useCallback((minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;

      let result = "";
      if (hours === 1) {
        result += `${hours} ${t("checkout.hour")}`;
      } else if (hours > 1) {
        result += `${hours} ${t("checkout.hours")}`;
      }

      if (mins > 0) {
        if (hours > 0) result += " ";
        result += `${mins} ${t("checkout.minutes")}`;
      }
      return result;
    }, []);

    useEffect(() => {
      if (loading) return;

      const draftOrder = getFromLocalStorage(localStorageKeys.draftOrder);

      if (draftOrder && Object.keys(draftOrder).length > 0) {
        return;
      }

      const userValues: Partial<FormValues> = {
        name: user ? getUserFullName(user) : "",
        apartment: user?.apartment ?? "",
        entrance: user?.entrance ?? "",
        floor: user?.floor ?? "",
        // house_type: user?.house_type as HouseType | HouseType.PrivateHouse,
        house: user?.house ?? "",
        street: user?.street ? Number(user.street) : "",
      };

      if (user?.phone?.startsWith("+38")) {
        userValues.phone = format(user.phone.slice(3), phoneMaskOptions);
      }

      formik.setValues({
        ...formik.values,
        ...userValues,
      });
    }, [loading, user]);

    return (
      <S.Container>
        {!user && (
          <FlexBox style={{ marginBottom: "20px" }}>
            <Trans
              showSkeleton={loading}
              i18nKey={"checkout.alreadyHaveAccount"}
            />
            <S.Login onClick={openLoginModal}>
              <Trans i18nKey={"common.login"} showSkeleton={loading} />
            </S.Login>
          </FlexBox>
        )}
        <S.Form onSubmit={formik.handleSubmit}>
          <SegmentedControl
            showSkeleton={loading}
            name={FormNames.ShippingMethodCode}
            items={shippingMethodOptions}
            value={formik.values[FormNames.ShippingMethodCode]}
            onChange={handleShippingMethodChange}
            ref={setFieldRef(FormNames.ShippingMethodCode)}
          />
          <S.Control>
            {isTakeawayShipmentMethod && spots.length !== 1 ? (
              <Dropdown
                showSkeleton={loading}
                placeholder={t("checkout.form.spot.placeholder")}
                options={spots}
                width={"350px"}
                value={formik.values[FormNames.SpotId]}
                ref={setFieldRef(FormNames.SpotId)}
                onChange={(value) => {
                  setFieldValue(FormNames.SpotId, value);
                }}
                error={
                  formik.touched[FormNames.SpotId] &&
                  formik.errors[FormNames.SpotId]
                }
              />
            ) : (
              districts.length !== 1 &&
              !addressAutocomplete && (
                <Dropdown
                  showSkeleton={loading}
                  placeholder={t("checkout.form.district.placeholder")}
                  options={districts}
                  width={"350px"}
                  value={formik.values[FormNames.DistrictId]}
                  ref={setFieldRef(FormNames.DistrictId)}
                  onChange={(value) => {
                    setFieldValue(FormNames.DistrictId, value);
                  }}
                  error={
                    formik.touched[FormNames.DistrictId] &&
                    formik.errors[FormNames.DistrictId]
                  }
                />
              )
            )}
          </S.Control>
          {isCourierShipmentMethod && (
            <>
              <S.Control>
                <SegmentedControl
                  showSkeleton={loading}
                  name={FormNames.HouseType}
                  items={houseTypes}
                  value={formik.values[FormNames.HouseType]}
                  onChange={handleHouseTypeChange}
                  ref={setFieldRef(FormNames.HouseType)}
                />
              </S.Control>

              <S.Control ref={setFieldRef(FormNames.Street)}>
                <FlexBox
                  style={{
                    gap: 10,
                  }}
                >
                  {addressAutocomplete ? (
                    <Autocomplete
                      style={style80}
                      //   name={FormNames.Street}
                      placeholder={t("checkout.form.street.placeholder")}
                      noResultsText={t("checkout.form.street.noResults")}
                      typeMoreText={t("checkout.form.street.typeMore")}
                      loading={loading || isAddressLoading}
                      value={formik.values[FormNames.Street]}
                      onChange={setFieldValueCallback}
                      error={
                        formik.touched[FormNames.Street] &&
                        formik.errors["street"]
                      }
                      duplicates={false}
                      data={addressesMemo ?? null}
                    />
                  ) : (
                    <Input
                      style={{ width: "80%" }}
                      loading={loading}
                      name={FormNames.Street}
                      placeholder={t("checkout.form.street.placeholder")}
                      onChange={handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values[FormNames.Street]}
                      error={
                        formik.touched[FormNames.Street] &&
                        formik.errors[FormNames.Street]
                      }
                      ref={setFieldRef(FormNames.Street)}
                    />
                  )}

                  <Input
                    style={{ width: "20%" }}
                    loading={loading}
                    name={FormNames.House}
                    placeholder={t("checkout.form.house.placeholder")}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values[FormNames.House]}
                    error={
                      formik.touched[FormNames.House] &&
                      formik.errors[FormNames.House]
                    }
                    ref={setFieldRef(FormNames.House)}
                  />
                </FlexBox>
                {addressAutocomplete && !(loading || isAddressLoading) && (
                  <S.Container>
                    {cartTotal < selectedAddress?.min && (
                      <>
                        <br />
                        <b>
                          {`Доставка кур'єром доступна для замовлень на суму від ${selectedAddress?.min} грн`}
                        </b>
                        <br />
                      </>
                    )}

                    {!!selectedAddress?.min_amount && deliveryFee !== 0 && (
                      <>
                        <br />
                        {`Безкоштовна доставка для замовлень на суму від
                        ${selectedAddress?.min_amount} грн`}
                      </>
                    )}
                  </S.Container>
                )}
              </S.Control>
              {formik.values.house_type === HouseType.HighRiseBuilding && (
                <S.Control>
                  <FlexBox
                    style={{
                      gap: 10,
                    }}
                  >
                    <Input
                      loading={loading}
                      name={FormNames.Apartment}
                      placeholder={t("checkout.form.apartment.placeholder")}
                      onChange={handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values[FormNames.Apartment]}
                      error={
                        formik.touched[FormNames.Apartment] &&
                        formik.errors[FormNames.Apartment]
                      }
                      ref={setFieldRef(FormNames.Apartment)}
                    />
                    <Input
                      loading={loading}
                      name={FormNames.Entrance}
                      placeholder={t("checkout.form.entrance.placeholder")}
                      onChange={handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values[FormNames.Entrance]}
                      error={
                        formik.touched[FormNames.Entrance] &&
                        formik.errors[FormNames.Entrance]
                      }
                      ref={setFieldRef(FormNames.Entrance)}
                    />
                    <Input
                      loading={loading}
                      name={FormNames.Floor}
                      placeholder={t("checkout.form.floor.placeholder")}
                      onChange={handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values[FormNames.Floor]}
                      error={
                        formik.touched[FormNames.Floor] &&
                        formik.errors[FormNames.Floor]
                      }
                      ref={setFieldRef(FormNames.Floor)}
                    />
                  </FlexBox>
                </S.Control>
              )}
            </>
          )}
          <S.Control>
            <Input
              loading={loading}
              name={FormNames.Name}
              placeholder={t("common.first_name")}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[FormNames.Name]}
              error={
                formik.touched[FormNames.Name] && formik.errors[FormNames.Name]
              }
              ref={setFieldRef(FormNames.Name)}
            />
          </S.Control>
          <S.Control>
            <Input
              loading={loading}
              name={FormNames.Phone}
              required={true}
              placeholder={t("common.phone")}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[FormNames.Phone]}
              error={
                formik.touched[FormNames.Phone] &&
                formik.errors[FormNames.Phone]
              }
              ref={composeRefs(phoneInputRef, setFieldRef(FormNames.Phone))}
            />
          </S.Control>
          <S.Control>
            <Input
              loading={loading}
              name={FormNames.Sticks}
              type={"number"}
              min={"0"}
              placeholder={t("checkout.form.persons")}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[FormNames.Sticks]}
              ref={setFieldRef(FormNames.Sticks)}
            />
          </S.Control>
          <S.Control>
            <Input
              loading={loading}
              name={FormNames.Comment}
              placeholder={t("checkout.form.comment")}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[FormNames.Comment]}
              ref={setFieldRef(FormNames.Comment)}
            />
          </S.Control>
          <S.Control>
            <SegmentedControl
              showSkeleton={loading}
              name={FormNames.PaymentMethodCode}
              items={filteredPaymentMethods}
              onChange={handleChange}
              value={formik.values[FormNames.PaymentMethodCode]}
              ref={setFieldRef(FormNames.PaymentMethodCode)}
            />
          </S.Control>
          {isCashPaymentMethod && (
            <S.Control>
              <Input
                loading={loading}
                name={FormNames.Change}
                placeholder={t("checkout.form.change")}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[FormNames.Change]}
                ref={setFieldRef(FormNames.Change)}
              />
            </S.Control>
          )}
          {isOnlinePaymentMethod && (
            <>
              <S.Control>
                <SkeletonWrap loading={loading}>
                  <Checkbox
                    name={FormNames.DontCall}
                    checked={formik.values[FormNames.DontCall]}
                    onChange={(e) => {
                      setFieldValue(FormNames.DontCall, e.target.checked);
                    }}
                  >
                    {t("checkout.form.dont_call")}
                  </Checkbox>
                </SkeletonWrap>
              </S.Control>
              {isOnlinePaymentMethod && (
                <SkeletonWrap loading={loading}>
                  {phoneConfirmed ? (
                    <p style={{ marginTop: "10px" }}>
                      <b>{t("phone.confirmed")}</b>
                    </p>
                  ) : (
                    <>
                      <p style={{ marginTop: "10px" }}>
                        {t("phone.confirm_first")}
                      </p>

                      <Input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        style={{ marginTop: "10px" }}
                        loading={loading}
                        placeholder={t("phone.enter_code")}
                        onChange={(e) => {
                          setSmsError("");
                          setError("");
                          setSmsCode(e.currentTarget.value);
                        }}
                        onBlur={formik.handleBlur}
                        value={smsCode}
                        error={smsError || error}
                      />

                      <FlexBox
                        style={{ marginTop: "10px" }}
                        justifyContent="space-around"
                      >
                        <Button
                          type="button"
                          style={{ width: "45%" }}
                          loading={sendSmsLoading}
                          disabled={smsCooldown > 0}
                          onClick={async () => {
                            await formik.validateForm();
                            formik.setFieldTouched(FormNames.Phone, true, true);
                            if (!formik.errors[FormNames.Phone]) {
                              sendSms();
                            }
                          }}
                        >
                          {smsCooldown > 0
                            ? `${t("phone.code_sent")} (${smsCooldown})`
                            : t("phone.send_code")}
                        </Button>
                        <Button
                          type="button"
                          style={{ width: "45%" }}
                          loading={verifySmsLoading}
                          disabled={
                            verifySmsLoading || isCheckCodeButtonDisabled
                          }
                          onClick={verifySms}
                        >
                          {t("phone.confirm_code")}
                        </Button>
                      </FlexBox>

                      {/* {error && (
                        <p style={{ color: "red", marginTop: "5px" }}>
                          {error}
                        </p>
                      )} */}
                    </>
                  )}
                </SkeletonWrap>
              )}
            </>
          )}
          <div
            style={{
              marginTop: 20,
            }}
          >
            <CheckoutRecommended
              loading={loading}
              products={recommendedProducts}
              cart={cart}
              unavailableCategories={unavailableCategories}
              unavailableProducts={unavailableProducts}
            />
          </div>
          <div
            style={{
              marginTop: 20,
            }}
          >
            {unavailableItems?.length > 0 ? (
              <S.Total
                style={{
                  justifyContent: "space-between",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <span style={{ color: "rgba(205, 56, 56, 1)" }}>
                  <Trans i18nKey={"checkout.form.unavailable_item"} />
                </span>
                {unavailableItems.map((el) => (
                  <span key={el}>— {el}</span>
                ))}
              </S.Total>
            ) : (
              <FlexBox flexDirection={"column"}>
                <SkeletonWrap
                  loading={
                    loading || (isCourierShipmentMethod && isAddressLoading)
                  }
                >
                  <FlexBox justifyContent={"space-between"}>
                    <Trans
                      showSkeleton={
                        loading || (isCourierShipmentMethod && isAddressLoading)
                      }
                      i18nKey={"checkout.order_price"}
                    />
                    <span>{cart?.total}</span>
                  </FlexBox>
                  {isCourierShipmentMethod && (
                    <>
                      <FlexBox justifyContent="space-between">
                        <Trans
                          showSkeleton={
                            loading ||
                            (isCourierShipmentMethod && isAddressLoading)
                          }
                          i18nKey="checkout.delivery_price"
                        />
                        <span>{deliveryFee} грн.</span>
                      </FlexBox>

                      {deliveryFee > 0 && (
                        <FlexBox justifyContent="space-between">
                          <Trans
                            showSkeleton={
                              loading ||
                              (isCourierShipmentMethod && isAddressLoading)
                            }
                            i18nKey="checkout.not_enough_for_free_delivery"
                          />
                          <span>
                            {selectedAddress?.min_amount - cartTotal} грн.
                          </span>
                        </FlexBox>
                      )}
                    </>
                  )}
                  <S.Total
                    style={{
                      marginTop: "20px",
                      justifyContent: "space-between",
                      display: "flex",
                    }}
                  >
                    <Trans i18nKey={"checkout.to_pay"} />
                    {/* &nbsp; */}
                    <span>{cart?.total ? `${total} грн.` : "🤪🤪🤪"}</span>
                  </S.Total>
                  {currentWaitTime > 0 && (
                    <S.Total
                      style={{
                        marginTop: "20px",
                        justifyContent: "space-between",
                        display: "flex",
                      }}
                    >
                      <Trans i18nKey={"checkout.wait_time"} />
                      <span style={{ textAlign: "right" }}>
                        {`${formatMinutes(currentWaitTime)}`}
                      </span>
                    </S.Total>
                  )}
                </SkeletonWrap>
              </FlexBox>
            )}
          </div>
          {unavailableItems?.length > 0 ||
          (isCourierShipmentMethod &&
            cartTotal < selectedAddress?.min) ? null : (
            <div style={{ marginTop: "20px" }}>
              <SkeletonWrap
                loading={
                  loading || (isCourierShipmentMethod && isAddressLoading)
                }
                style={{ width: "100%" }}
              >
                <Button
                  loading={formik.isSubmitting}
                  disabled={formik.isSubmitting}
                  showSkeleton={
                    loading || (isCourierShipmentMethod && isAddressLoading)
                  }
                  type={"submit"}
                  style={{
                    width: "100%",
                  }}
                >
                  {t("checkout.order")}
                </Button>
              </SkeletonWrap>
            </div>
          )}
        </S.Form>
        <div style={{ display: "none" }} ref={wayforpayFormContainer}></div>
      </S.Container>
    );
  }
);
