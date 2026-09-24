import styled from "styled-components";
import { PropsWithChildren } from "react";
import { flexbox, FlexboxProps } from "styled-system";
import { media } from "~common/custom-media";
import { ROUTES } from "~routes";

export const Container = styled.div<PropsWithChildren<FlexboxProps>>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 700px;
  padding: 50px 20px;
  margin: 0 auto;

  ${media.lessThan("pc")`
    max-width: 730px;
    padding: 40px 20px;
  `}

  ${media.lessThan("tablet")`
    max-width: 350px;
  `}

  ${flexbox}
`;

const H1 = styled.h1`
  margin-bottom: 20px;
`;

const H2 = styled.h2`
  margin-top: 30px;
  margin-bottom: 10px;
`;

const Paragraph = styled.p`
  line-height: 1.7;
`;

const Link = styled.a`
  color: #0066cc;
`;

export const AppSupportPage = () => {
  return (
    <Container>
      <H1>Підтримка EmojiSushi</H1>

      <Paragraph>
        Ласкаво просимо на сторінку підтримки мобільного застосунку EmojiSushi.
        Якщо у вас виникли питання, проблеми з використанням застосунку або ви
        хочете повідомити про помилку, зверніться до нашої служби підтримки.
      </Paragraph>

      <H2>Контактна інформація</H2>

      <Paragraph>
        Електронна пошта:{" "}
        <Link href="mailto:support@emojisushi.com.ua">
          support@emojisushi.com.ua
        </Link>
        <br />
        Телефон: +38 093 366 28 69
      </Paragraph>

      <H2>Часті запитання</H2>

      <Paragraph>
        <strong>Як отримати допомогу?</strong>
        <br />
        Напишіть нам на електронну адресу підтримки. Будь ласка, опишіть вашу
        проблему якомога детальніше, і наша команда відповість вам у найкоротші
        терміни.
      </Paragraph>

      <Paragraph>
        <strong>Як повідомити про помилку в застосунку?</strong>
        <br />
        Надішліть опис проблеми, модель вашого пристрою, версію операційної
        системи та, за можливості, скріншоти помилки.
      </Paragraph>

      <Paragraph>
        <strong>Як змінити або видалити мої персональні дані?</strong>
        <br />
        Для зміни або видалення персональних даних зверніться до служби
        підтримки EmojiSushi за вказаною електронною адресою.
      </Paragraph>

      <H2>Політика конфіденційності</H2>

      <Paragraph>
        Детальніше про те, як ми збираємо, використовуємо та захищаємо ваші
        персональні дані, ви можете прочитати у нашій{" "}
        <Link href={ROUTES.PRIVACY_POLICY.path}>Політиці конфіденційності</Link>
        .
      </Paragraph>
    </Container>
  );
};

export const Component = AppSupportPage;
