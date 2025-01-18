import * as S from "./styled";
import {
  BurgerSvg,
  CartButton,
  FlexBox,
  HightlightText,
  LanguageSelector,
  LogoSvg,
  SvgButton,
  SvgIcon,
  TinyCartButton,
  Container,
  UserSvg,
  SkeletonWrap,
  DropdownPopoverOption,
  DropdownPopover,
} from "~components";

import { ICity, IUser } from "@layerok/emojisushi-js-sdk";
import { ModalIDEnum } from "~common/modal.constants";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { LEAVE_REVIEW_LINK, ROUTES } from "~routes";
import { useShowModal } from "~modal";
import { useTheme } from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { citiesQuery } from "~domains/city/cities.query";
import { useCurrentCitySlug } from "~domains/city/hooks/useCurrentCitySlug";
import { LOCATION_CONFIRMED_SEARCH_PARAM } from "~common/constants";
import { LocationDropdownTrigger } from "~layout/Header/LocationDropdownTrigger";
import { useCartTotals } from "~domains/cart/hooks/use-cart-totals";

export const Header = ({
  loading = false,
  user,
}: {
  loading?: boolean;
  user?: IUser;
  cities?: ICity[];
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const showModal = useShowModal();
  const theme = useTheme();

  const location = useLocation();

  const { data: cities, isLoading } = useQuery(citiesQuery);

  const cartTotals = useCartTotals();
  const citySlug = useCurrentCitySlug();

  const renderLocationDropdown = () => {
    const cityOptions = (cities?.data || []).map((city) => ({
      id: city.slug,
      name: city.name,
    }));

    const selectedCityOption = cityOptions.find(
      (option) => option.id === citySlug
    );
    const selectedCityIndex = cityOptions.indexOf(selectedCityOption);
    const handleLocationSelect = ({
      option,
    }: {
      option: DropdownPopoverOption;
    }) => {
      const city = cities.data.find((city) => city.slug === option.id);
      window.location.href =
        city.frontend_url +
        location.pathname +
        `?${LOCATION_CONFIRMED_SEARCH_PARAM}=true`;
    };
    return (
      <DropdownPopover
        backgroundColor={theme.colors.canvas.inset}
        width={"160px"}
        offset={22}
        options={cityOptions}
        selectedIndex={selectedCityIndex}
        onSelect={handleLocationSelect}
      >
        {({ selectedOption }) => (
          <LocationDropdownTrigger title={selectedOption?.name} />
        )}
      </DropdownPopover>
    );
  };

  return (
    <S.Container>
      <Container
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <FlexBox alignItems={"center"}>
          <S.LogoContainer>
            <SkeletonWrap loading={loading}>
              <Link to={ROUTES.INDEX.path}>
                <SvgIcon clickable={true} color={theme.colors.brand}>
                  <LogoSvg />
                </SvgIcon>
              </Link>
            </SkeletonWrap>
          </S.LogoContainer>

          <S.HeaderItem>
            <SkeletonWrap loading={loading}>
              {renderLocationDropdown()}
            </SkeletonWrap>
          </S.HeaderItem>

          <S.HeaderItem
            onClick={() => {
              showModal(ModalIDEnum.ContactsModal);
            }}
          >
            <SkeletonWrap loading={loading}>
              <HightlightText>
                <Trans i18nKey="header.contacts" />
              </HightlightText>
            </SkeletonWrap>
          </S.HeaderItem>

          <S.HeaderItem>
            <SkeletonWrap loading={loading}>
              <NavLink
                style={{
                  color: "white",
                  textDecoration: "none",
                }}
                to={ROUTES.DELIVERYANDPAYMENT.path}
              >
                {({ isActive }) => (
                  <HightlightText isActive={isActive}>
                    {t("header.delivery")}
                  </HightlightText>
                )}
              </NavLink>
            </SkeletonWrap>
          </S.HeaderItem>
          <S.HeaderItem>
            <SkeletonWrap loading={loading}>
              <a
                target={"_blank"}
                href={LEAVE_REVIEW_LINK}
                style={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                <HightlightText>
                  <Trans i18nKey="menu-title.leave-review" />
                </HightlightText>
              </a>
            </SkeletonWrap>
          </S.HeaderItem>
        </FlexBox>
        <FlexBox alignItems={"center"}>
          <S.LanguageSelectorContainer>
            <LanguageSelector loading={loading} />
          </S.LanguageSelectorContainer>

          <S.CartBtn>
            <SkeletonWrap borderRadius={10} loading={loading}>
              <CartButton
                onClick={() => {
                  showModal(ModalIDEnum.CartModal);
                }}
                count={cartTotals.totalQuantity}
                total={cartTotals.total}
              />
            </SkeletonWrap>
          </S.CartBtn>

          {!loading && (
            <S.TinyCartBtn
              onClick={() => {
                showModal(ModalIDEnum.CartModal);
              }}
            >
              <TinyCartButton loading={loading} price={cartTotals.total} />
            </S.TinyCartBtn>
          )}

          <S.BurgerBtn>
            <SkeletonWrap loading={loading}>
              <SvgIcon
                onClick={() => {
                  showModal(ModalIDEnum.MobMenuModal);
                }}
                width={"32px"}
                color={"white"}
              >
                <BurgerSvg />
              </SvgIcon>
            </SkeletonWrap>
          </S.BurgerBtn>

          <S.UserBtn>
            <SkeletonWrap loading={loading} borderRadius={10}>
              <SvgButton
                onClick={() => {
                  if (user) {
                    navigate(ROUTES.ACCOUNT.PROFILE.path);
                  } else {
                    showModal(ModalIDEnum.AuthModal);
                  }
                }}
              >
                <SvgIcon clickable={true} width={"25px"} color={"black"}>
                  <UserSvg />
                </SvgIcon>
              </SvgButton>
            </SkeletonWrap>
          </S.UserBtn>
        </FlexBox>
      </Container>
    </S.Container>
  );
};
