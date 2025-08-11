import * as S from "./styled";
import {
  SvgIcon,
  FlexBox,
  Modal,
  HeartSvg,
  UserSvg,
  LanguageSelector,
  DropdownPopoverOption,
  DropdownPopover,
} from "~components";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { HightlightText } from "~components";
import { useUser } from "~hooks/use-auth";
import NiceModal from "@ebay/nice-modal-react";
import { ModalIDEnum } from "~common/modal.constants";
import { useQuery } from "@tanstack/react-query";
import { citiesQuery } from "~domains/city/cities.query";
import { LEAVE_REVIEW_LINK, ROUTES } from "~routes";
import { useModal } from "~modal";
import { useTheme } from "styled-components";
import { useCurrentCitySlug } from "~domains/city/hooks/useCurrentCitySlug";
import { LOCATION_CONFIRMED_SEARCH_PARAM } from "~common/constants";
import { LocationDropdownTrigger } from "~components/modals/MobMenuModal/LocationDropdownTrigger";
import { useClientAppVersion } from "~hooks/use-client-app-version";

export const MobMenuModal = NiceModal.create(() => {
  const modal = useModal();
  const { data: cities, isLoading: isCitiesLoading } = useQuery(citiesQuery);
  const theme = useTheme();
  const overlayStyles = {
    justifyContent: "end",
    alignItems: "start",
  };
  const appVersion = useClientAppVersion();
  const { data: user } = useUser();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const location = useLocation();

  const citySlug = useCurrentCitySlug();

  if (isCitiesLoading) {
    return null;
  }

  const renderCitiesDropdown = () => {
    const options = (cities?.data || []).map((city) => ({
      id: city.slug,
      name: city.name,
    }));

    const selectedOption = options.find((option) => option.id === citySlug);
    const selectedIndex = options.indexOf(selectedOption);
    const handleSelect = ({ option }: { option: DropdownPopoverOption }) => {
      const city = cities.data.find((city) => city.slug === option.id);
      window.location.href =
        city.frontend_url +
        location.pathname +
        `?${LOCATION_CONFIRMED_SEARCH_PARAM}=true`;
    };
    return (
      <DropdownPopover
        backgroundColor={theme.colors.canvas.inset2}
        width={"226px"}
        offset={0}
        options={options}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
      >
        {({ selectedOption }) => (
          <LocationDropdownTrigger title={selectedOption?.name} />
        )}
      </DropdownPopover>
    );
  };

  return (
    <Modal
      open={modal.visible}
      onClose={() => {
        modal.remove();
      }}
      overlayStyles={overlayStyles}
    >
      <S.Wrapper>
        <S.Item>
          <LanguageSelector />
        </S.Item>
        <S.Item style={{ height: "25px" }}>{renderCitiesDropdown()}</S.Item>
        <S.Item>
          {user ? (
            <FlexBox
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                navigate(ROUTES.ACCOUNT.path);
                modal.remove();
              }}
              alignItems={"center"}
            >
              <SvgIcon width={"25px"} style={{ marginRight: "10px" }}>
                <UserSvg />
              </SvgIcon>
              {t("account.cabinet")}
            </FlexBox>
          ) : (
            <FlexBox
              alignItems={"center"}
              onClick={() => {
                NiceModal.show(ModalIDEnum.AuthModal);
                modal.remove();
              }}
            >
              <SvgIcon width={"25px"} style={{ marginRight: "10px" }}>
                <UserSvg />
              </SvgIcon>
              {t("common.enter_account")}
            </FlexBox>
          )}
        </S.Item>
        <S.Item>
          <div
            onClick={() => {
              NiceModal.show(ModalIDEnum.ContactsModal);
              modal.remove();
            }}
          >
            {t("mobMenuModal.contacts")}
          </div>
        </S.Item>
        <S.Item>
          <NavLink
            style={{ color: "white", textDecoration: "none" }}
            to={ROUTES.DELIVERYANDPAYMENT.path}
            onClick={() => {
              modal.remove();
            }}
          >
            {({ isActive }) => (
              <HightlightText isActive={isActive}>
                <div>{t("mobMenuModal.delivery")}</div>
              </HightlightText>
            )}
          </NavLink>
        </S.Item>
        <S.Item>
          <a
            style={{ color: "white", textDecoration: "none" }}
            href={LEAVE_REVIEW_LINK}
            target={"_blank"}
          >
            <HightlightText>
              <div>{t("menu-title.leave-review")}</div>
            </HightlightText>
          </a>
        </S.Item>
        <S.Item>
          <FlexBox justifyContent={"space-between"} alignItems={"center"}>
            <NavLink
              style={{ color: "white", textDecoration: "none" }}
              to={ROUTES.CATEGORY.WISHLIST.path}
              onClick={() => {
                modal.remove();
              }}
            >
              {({ isActive }) => (
                <HightlightText isActive={isActive}>
                  <div>{t("common.favorite")}</div>
                </HightlightText>
              )}
            </NavLink>
            <SvgIcon color={theme.colors.brand} width={"25px"}>
              <HeartSvg />
            </SvgIcon>
          </FlexBox>
        </S.Item>
        <S.AppVersion>
          {t("app_version")}: {appVersion}
        </S.AppVersion>
      </S.Wrapper>
    </Modal>
  );
});
