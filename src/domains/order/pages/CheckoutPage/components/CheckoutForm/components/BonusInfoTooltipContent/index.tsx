import * as S from "./styled";
import { useTranslation } from "react-i18next";

export const BonusInfoTooltipContent = ({ maxBonus }: { maxBonus: number }) => {
  const { t } = useTranslation();
  return (
    <S.Wrapper>
      <S.Item>
        <S.Title>
          {t("checkout.form.bonus_info.limit_title", { amount: maxBonus })}
        </S.Title>
        <S.Description>
          {t("checkout.form.bonus_info.limit_description", {
            amount: maxBonus,
          })}
        </S.Description>
      </S.Item>
      <S.Item>
        <S.Title>{t("checkout.form.bonus_info.excluded_title")}</S.Title>
        <S.Description>
          {t("checkout.form.bonus_info.excluded_description")}
        </S.Description>
      </S.Item>
    </S.Wrapper>
  );
};
