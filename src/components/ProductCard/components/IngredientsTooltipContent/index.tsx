import * as S from "./styled";
import { useTranslation } from "react-i18next";

export const IngredientsTooltipContent = ({ items }: { items: string[] }) => {
  const { t } = useTranslation();
  return (
    <S.Wrapper>
      <S.Title>{t("ingredients.ingredients")}</S.Title>
      <S.List>
        {items.map((item, i) => (
          <S.ListItem key={i}>{item}</S.ListItem>
        ))}
      </S.List>
    </S.Wrapper>
  );
};
