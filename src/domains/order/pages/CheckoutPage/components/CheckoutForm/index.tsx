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
  IDistrict,
  IGetCartRes,
  IGetPaymentMethodsRes,
  IGetShippingMethodsRes,
  ISpot,
  IUser,
  PaymentMethodCodeEnum,
  ShippingMethodCodeEnum,
} from "~api/types";
import { ChangeEvent, useRef, useState } from "react";
import { orderApi } from "~api";
import { queryClient } from "~query-client";
import { cartQuery } from "~queries";
import { AxiosError } from "axios";
import { observer } from "mobx-react";
import { useAppStore } from "~stores/appStore";
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

type TCheckoutFormProps = {
  loading?: boolean | undefined;
  user?: IUser | undefined;
  cart?: IGetCartRes | undefined;
  shippingMethods?: IGetShippingMethodsRes | undefined;
  paymentMethods?: IGetPaymentMethodsRes | undefined;
  spots?: ISpot[];
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

const getDistrictDefaultSpot = (district: IDistrict) => {
  return district.spots[0];
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

export const CheckoutForm = observer(
  ({
    cart,
    shippingMethods: shippingMethodsRes,
    paymentMethods: paymentMethodsRes,
    user,
    spots: spotsRes,
    loading = false,
  }: TCheckoutFormProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const appStore = useAppStore();
    const showModal = useShowModal();

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

    const spots = (appStore.city.spots || []).map((spot) => ({
      label: spot.name,
      value: spot.id,
      disabledText: t("checkout.temporarilyUnavailable"),
      disabled: !user?.is_call_center_admin && spot.temporarily_unavailable,
    }));

    const districts = (appStore.city.districts || []).map((district) => ({
      label: district.name,
      value: district.id,
      disabledText: t("checkout.temporarilyUnavailable"),
      disabled:
        !user?.is_call_center_admin &&
        getDistrictDefaultSpot(district).temporarily_unavailable,
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

    const handleSubmit = async (values: FormValues) => {
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

      const district = appStore.city.districts.find(
        (district) => district.id === district_id
      );

      const resultant_spot_id = isTakeawayShipmentMethod
        ? spot_id
        : getDistrictDefaultSpot(district).id;

      const paymentMethod = paymentMethodsRes.data.find(
        (method) => method.code === payment_method_code
      );
      const shippingMethod = shippingMethodsRes.data.find(
        (method) => method.code === shipping_method_code
      );

      try {
        const res = await orderApi.place({
          phone,
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
        });
        removeFromLocalStorage(localStorageKeys.draftOrder);

        // todo: clear cart after you redirected user to thankyou page
        // otherwise user will be redirected to category page
        await queryClient.removeQueries(cartQuery.queryKey);

        if (res.data?.form) {
          wayforpayFormContainer.current.innerHTML = res.data.form;
          wayforpayFormContainer.current.querySelector("form").submit();
        } else {
          const order_id = res.data?.poster_order?.incoming_order_id;
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
        if (e instanceof AxiosError) {
          if (e.response?.data?.errors) {
            formik.setErrors(e.response.data.errors);
          }
        }
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

    const shippingMethods = (shippingMethodsRes?.data || []).map((item) => ({
      value: item.code,
      // todo: don't use dynamic translation keys
      label: t("shippingMethods." + item.code, item.name),
    }));

    const paymentMethods = (paymentMethodsRes?.data || []).map((item) => ({
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
            items={shippingMethods}
            value={formik.values.shipping_method_code}
            onChange={handleShippingMethodChange}
          />

          <S.Control>
            {isTakeawayShipmentMethod && spots.length !== 1 ? (
              <Dropdown
                showSkeleton={loading}
                placeholder={t("checkout.form.spot.placeholder")}
                options={spots}
                width={"350px"}
                value={formik.values[FormNames.SpotId]}
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
                    value={formik.values.street}
                    error={formik.touched["street"] && formik.errors["street"]}
                  />
                  <Input
                    style={{ width: "30%" }}
                    loading={loading}
                    name={FormNames.House}
                    placeholder={t("checkout.form.house.placeholder")}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.house}
                    error={formik.touched["house"] && formik.errors["house"]}
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
                      value={formik.values.apartment}
                      error={
                        formik.touched["apartment"] &&
                        formik.errors["apartment"]
                      }
                    />
                    <Input
                      loading={loading}
                      name={FormNames.Entrance}
                      placeholder={t("checkout.form.entrance.placeholder")}
                      onChange={handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.entrance}
                      error={
                        formik.touched["entrance"] && formik.errors["entrance"]
                      }
                    />
                    <Input
                      loading={loading}
                      name={FormNames.Floor}
                      placeholder={t("checkout.form.floor.placeholder")}
                      onChange={handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.floor}
                      error={formik.touched["floor"] && formik.errors["floor"]}
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
              value={formik.values.name}
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
              value={formik.values.phone}
              error={formik.touched["phone"] && formik.errors["phone"]}
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
              value={formik.values.sticks}
            />
          </S.Control>
          <S.Control>
            <Input
              loading={loading}
              name={FormNames.Comment}
              placeholder={t("checkout.form.comment")}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.comment}
            />
          </S.Control>
          <S.Control>
            <SegmentedControl
              showSkeleton={loading}
              name={FormNames.PaymentMethodCode}
              items={paymentMethods}
              onChange={handleChange}
              value={formik.values.payment_method_code}
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
                value={formik.values.change}
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
