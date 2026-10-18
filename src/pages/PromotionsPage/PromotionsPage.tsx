import { Container, Heading, SvgIcon } from "~components";
import { Page } from "~components/Page";
import { ArrowUpSvg } from "~components/svg/ArrowUpSvg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { promotionsQuery } from "~domains/promotions/promotions.query";
import { Helmet } from "react-helmet";
import * as S from "./styled";

const title = "Акції | EmojiSushi - роли та піца";
const description =
  "Актуальні акції та вигідні пропозиції Emoji Sushi 🍣 — знижки, кешбек та подарунки при замовленні суші, ролів та піци в Одесі.";
const url = "https://emojisushi.com.ua/promotions";

export const PromotionsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: promotions, isLoading } = useQuery(promotionsQuery);

  if (isLoading) {
    return null;
  }

  return (
    <Page>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://odesa.emojisushi.com.ua/favicon-32x32.png"
        />
      </Helmet>
      <Container>
        <S.BackButton onClick={() => navigate(-1)}>
          <SvgIcon width={"9px"} style={{ transform: "rotate(-90deg)" }}>
            <ArrowUpSvg />
          </SvgIcon>
          {t("common.back")}
        </S.BackButton>
        <Heading style={{ textAlign: "center", marginBottom: "40px" }}>
          {t("promotions.title")}
        </Heading>
        {promotions?.length ? (
          <S.Grid>
            {promotions.map((promotion) => (
              <S.Card key={promotion.id}>
                <S.Title>{promotion.header}</S.Title>
                <S.HorizontalBar />
                {!!promotion.image && (
                  <S.Image src={promotion.image.path} alt={promotion.header} />
                )}
                {!!promotion.text && (
                  <S.Content
                    dangerouslySetInnerHTML={{ __html: promotion.text }}
                  />
                )}
              </S.Card>
            ))}
          </S.Grid>
        ) : (
          <S.Empty>{t("promotions.empty")}</S.Empty>
        )}
      </Container>
    </Page>
  );
};

export const Component = PromotionsPage;
Object.assign(Component, {
  displayName: "LazyPromotionsPage",
});
