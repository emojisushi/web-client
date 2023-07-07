import * as S from "./styled";
import {
  ContactsModal,
  LocationPickerPopover,
  HightlightText,
} from "~components";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { Logo } from "../Logo";
import { NavLink } from "react-router-dom";
import { ISpot } from "~api/types";
import { observer } from "mobx-react";

type LeftProps = { loading?: boolean; spots?: ISpot[] };

export const Left = observer(({ loading = false, spots = [] }: LeftProps) => {
  const { t } = useTranslation();

  return (
    <S.Left>
      <Logo loading={loading} />
      <S.HeaderItem>
        <LocationPickerPopover spots={spots} loading={loading} offset={22} />
      </S.HeaderItem>
      <S.HeaderItem>
        {loading ? (
          <Skeleton width={71} height={17.25} />
        ) : (
          <ContactsModal>
            <div>{t("header.contacts")}</div>
          </ContactsModal>
        )}
      </S.HeaderItem>

      <S.HeaderItem>
        {loading ? (
          <Skeleton width={144} height={17.25} />
        ) : (
          <NavLink
            style={{ color: "white", textDecoration: "none", width: "144px" }}
            to={"/dostavka-i-oplata"}
          >
            {({ isActive }) => (
              <HightlightText isActive={isActive}>
                {t("header.delivery")}
              </HightlightText>
            )}
          </NavLink>
        )}
      </S.HeaderItem>
    </S.Left>
  );
});
