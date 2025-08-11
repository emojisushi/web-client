import {
  FlexBox,
  Input,
  SegmentedControl,
  Dropdown,
  SkeletonWrap,
  Trans,
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
  IShippingMethod,
  ISpot,
  IUser,
  PaymentMethodCodeEnum,
  ShippingMethodCodeEnum,
} from "@layerok/emojisushi-js-sdk";
import { ChangeEvent, useEffect, useRef, useState } from "react";
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
import { useClearCart } from "~domains/cart/hooks/use-clear-cart";
import { unformat, useMask } from "@react-input/mask";
import { composeRefs } from "~utils/ref";

type TCheckoutFormProps = {
  loading?: boolean | undefined;
  user?: IUser | undefined;
  cart?: Cart | undefined;
  shippingMethods?: IShippingMethod[] | undefined;
  paymentMethods?: IPaymentMethod[] | undefined;
  spots?: ISpot[];
  city?: ICity;
  onRedirectToThankYouPage?: () => void;
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
  street: string;
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
  }: TCheckoutFormProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const showModal = useShowModal();
    const phoneInputRef = useMask(phoneMaskOptions);

    const { mutate: clearCart } = useClearCart();

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
      street: Yup.string().required(t("validation.required")),
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
      street: Yup.string().required(t("validation.required")),
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

    const initialValues: FormValues = {
      name: user && !user.is_call_center_admin ? getUserFullName(user) : "",
      phone: user && !user.is_call_center_admin ? user.phone || "" : "",
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
      district_id: districts.length === 1 ? districts[0].value : undefined,
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
    });

    const handleSubmit = async (values: typeof initialValues) => {
      formik.setErrors({});
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
      const address = [
        ["Вулиця", street],
        ["Будинок", house],
        ["Квартира", apartment],
        ["Під'їзд", entrance],
        ["Поверх", floor],
      ]
        .filter(([label, value]) => !!value)
        .map(([label, value]) => `${label}: ${value}`)
        .join(", ");

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

      try {
        const res = await EmojisushiAgent.placeOrderV2({
          phone: unformat(phone, phoneMaskOptions),
          firstname,
          lastname,
          email: user ? user.email : "",

          address,
          payment_method_id: paymentMethod.id,
          shipping_method_id: shippingMethod.id,
          spot_id: resultant_spot_id,

          change,
          sticks: +sticks,
          comment,
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
          wayforpayFormContainer.current.querySelector("form").submit();
        } else {
          const order_id = res.data?.poster_order?.incoming_order_id;
          clearCart();
          navigate(
            ROUTES.THANKYOU.buildPath(
              {},
              {
                order_id: !!order_id ? `${order_id}` : "",
              }
            )
          );
        }
      } catch (e) {
        if (!axios.isAxiosError(e)) {
          // todo: log
          return;
        }
        const { data } = (e as AxiosError<ErrorResponse>).response;

        const errors = data?.errors;
        //const message = data?.message;

        if (!errors) {
          return;
        }

        if (errors.firstname) {
          formik.setFieldError(FormNames.Name, errors.firstname[0]);
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

    const setFieldRef =
      (name: keyof FormValues) => (node: HTMLElement | null) =>
        (fieldsRef.current[name] = node);

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
              districts.length !== 1 && (
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
              <S.Control>
                <FlexBox
                  style={{
                    gap: 10,
                  }}
                >
                  <Input
                    style={{ width: "70%" }}
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
                  <Input
                    style={{ width: "30%" }}
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
              items={paymentMethodOptions}
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

          <div
            style={{
              marginTop: 20,
            }}
          >
            <FlexBox justifyContent={"space-between"} alignItems={"flex-end"}>
              <Button
                loading={formik.isSubmitting}
                showSkeleton={loading}
                type={"submit"}
                style={{
                  width: 160,
                }}
              >
                {t("checkout.order")}
              </Button>

              <S.Total>
                <Trans showSkeleton={loading} i18nKey={"checkout.to_pay"} />
                &nbsp;
                <SkeletonWrap loading={loading}>
                  {cart?.total ? cart.total : "🤪🤪🤪"}
                </SkeletonWrap>
              </S.Total>
            </FlexBox>
          </div>
        </S.Form>
        <div style={{ display: "none" }} ref={wayforpayFormContainer}></div>
      </S.Container>
    );
  }
);
