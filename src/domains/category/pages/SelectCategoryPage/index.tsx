import * as S from "./styled";
import { useTranslation } from "react-i18next";
import { Container, SvgIcon, ToteSvg } from "~components";
import { Category } from "./components/Category";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react";
import { Page } from "~components/Page";
import { catalogQuery } from "~domains/catalog/catalog.query";

export const SelectCategoryPage = observer(() => {
  const { t } = useTranslation();

  const { data: catalogData, isLoading: isCatalogLoading } =
    useQuery(catalogQuery);

  return (
    <Page>
      <Container>
        <S.Category>
          <S.CategoryContainer>
            <S.CategoryLabel>
              {isCatalogLoading ? (
                <Skeleton width={220} height={20} />
              ) : (
                <>
                  {t("categoryIndex.title")}
                  <S.IconWrapper>
                    <SvgIcon width={"auto"} color={"white"}>
                      <ToteSvg />
                    </SvgIcon>
                  </S.IconWrapper>
                </>
              )}
            </S.CategoryLabel>
            <S.CategoryItems>
              {isCatalogLoading ? (
                <S.CategoryList>
                  <Category />
                  <Category />
                  <Category />
                  <Category />
                  <Category />
                  <Category />
                  <Category />
                  <Category />
                  <Category />
                  <Category />
                  <Category />
                </S.CategoryList>
              ) : (
                <S.CategoryList>
                  {catalogData.categories.map((category) => (
                    <Category key={category.id} category={category} />
                  ))}
                </S.CategoryList>
              )}
            </S.CategoryItems>
          </S.CategoryContainer>
        </S.Category>
      </Container>
    </Page>
  );
});

export const Component = SelectCategoryPage;

Object.assign(SelectCategoryPage, {
  displayName: "LazySelectCategoryPage",
});
