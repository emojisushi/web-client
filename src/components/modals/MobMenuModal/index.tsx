import { ReactElement, cloneElement } from "react";
import * as S from "./styled";
import {
  LocationPickerPopover,
  SvgIcon,
  FlexBox,
  ContactsModal,
  BaseModal,
  HeartSvg,
  UserSvg,
  AuthModal,
  LanguageSelector,
} from "~components";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { ICity } from "~api/types";
import { HightlightText } from "~components";
import { useQuery } from "@tanstack/react-query";
import { spotQuery } from "~domains/spot/queries/spot.query";
import { useUser } from "~hooks/use-auth";
import { useAppStore } from "~stores/appStore";
import { observer } from "mobx-react";

type MobMenuModalProps = {
  children: ReactElement;
  cities?: ICity[];
};

export const MobMenuModal = observer(
  ({ children, cities = [] }: MobMenuModalProps) => {
    const overlayStyles = {
      justifyItems: "end",
      alignItems: "start",
      background: "rgba(0, 0, 0, 0.4)",
      display: "grid",
      zIndex: 999999,
    };
    const appStore = useAppStore();
    const { data: user } = useUser();
    const { t } = useTranslation();
    const { data: spot, isLoading } = useQuery(spotQuery(appStore.spot.slug));

    const navigate = useNavigate();
    return (
      <BaseModal
        overlayStyles={overlayStyles}
        render={({ close }) => (
          <S.Wrapper>
            <S.Item>
              <LanguageSelector />
            </S.Item>
            <S.Item style={{ height: "25px" }}>
              <LocationPickerPopover
                cities={cities}
                width={"226px"}
                backgroundColor={"#1C1C1C"}
              />
            </S.Item>
            <S.Item>
              {user ? (
                <FlexBox
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate("/account");
                  }}
                  alignItems={"center"}
                >
                  <SvgIcon width={"25px"} style={{ marginRight: "10px" }}>
                    <UserSvg />
                  </SvgIcon>
                  {t("account.cabinet")}
                </FlexBox>
              ) : (
                <AuthModal redirect_to={undefined}>
                  <FlexBox alignItems={"center"}>
                    <SvgIcon width={"25px"} style={{ marginRight: "10px" }}>
                      <UserSvg />
                    </SvgIcon>
                    {t("common.enter_account")}
                  </FlexBox>
                </AuthModal>
              )}
            </S.Item>
            <S.Item>
              {!isLoading && (
                <ContactsModal spot={spot}>
                  <div>{t("mobMenuModal.contacts")}</div>
                </ContactsModal>
              )}
            </S.Item>
            <S.Item>
              <NavLink
                style={{ color: "white", textDecoration: "none" }}
                to={"/dostavka-i-oplata"}
              >
                {({ isActive }) => (
                  <HightlightText isActive={isActive}>
                    <div>{t("mobMenuModal.delivery")}</div>
                  </HightlightText>
                )}
              </NavLink>
            </S.Item>
            <S.Item>
              <FlexBox justifyContent={"space-between"} alignItems={"center"}>
                <NavLink
                  style={{ color: "white", textDecoration: "none" }}
                  to={"/wishlist"}
                >
                  {({ isActive }) => (
                    <HightlightText isActive={isActive}>
                      <div>{t("common.favorite")}</div>
                    </HightlightText>
                  )}
                </NavLink>
                <SvgIcon color={"#FFE600"} width={"25px"}>
                  <HeartSvg />
                </SvgIcon>
              </FlexBox>
            </S.Item>
          </S.Wrapper>
        )}
      >
        {cloneElement(children)}
      </BaseModal>
    );
  }
);
