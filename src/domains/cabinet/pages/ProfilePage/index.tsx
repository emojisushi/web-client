import * as S from "./styled";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUser } from "~hooks/use-auth";
import { ROUTES } from "~routes";
import { Button } from "~common/ui-components/Button/Button";
import { useQuery } from "@tanstack/react-query";
import { userBonusQuery } from "~domains/order/bonus.query";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: user } = useUser();
  const { data: userBonus } = useQuery(userBonusQuery);

  return (
    <S.Properties>
      <S.Property>
        <S.PropertyLabel>{t("common.first_name")}</S.PropertyLabel>
        <S.PropertyValue>
          {user.name} {user.surname}
        </S.PropertyValue>
      </S.Property>

      <S.Property>
        <S.PropertyLabel>{t("common.email")}</S.PropertyLabel>
        <S.PropertyValue>{user.email}</S.PropertyValue>
      </S.Property>
      <S.Property>
        <S.PropertyLabel>{t("common.phone")}</S.PropertyLabel>
        <S.PropertyValue>{user.phone}</S.PropertyValue>
      </S.Property>
      {userBonus?.enabled && (
        <S.Property>
          <S.PropertyLabel>{t("account.profile.bonusBalance")}</S.PropertyLabel>
          <S.PropertyValue>
            {Math.floor(userBonus.available / 100)} ₴
          </S.PropertyValue>
        </S.Property>
      )}

      <S.BtnGroup>
        <Button
          skin={"grey"}
          onClick={() => {
            navigate(ROUTES.ACCOUNT.PROFILE.EDIT.path);
          }}
          style={{ minWidth: "309px" }}
        >
          {t("account.profile.editProfile")}
        </Button>
      </S.BtnGroup>
    </S.Properties>
  );
};

export const Component = ProfilePage;
Object.assign(Component, {
  displayName: "LazyProfilePage",
});
