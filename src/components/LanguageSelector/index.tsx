import * as S from "./styled";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import i18next from "i18next";
import { observer } from "mobx-react";
import { appStore } from "~stores/appStore";

type TLanguateSelectorProps = {
  loading?: boolean;
};

export const LanguageSelector = observer(
  ({ loading = false }: TLanguateSelectorProps) => {
    const [langs] = useState(["uk", "en"]);

    if (loading) {
      return <Skeleton borderRadius={10} height={40} width={75} />;
    }

    return (
      <S.Container>
        {langs.map((lang) => (
          <S.Item
            key={lang}
            style={{
              color: lang === appStore.lng ? "white" : "#B6B6B6",
            }}
            onClick={() => {
              i18next.changeLanguage(lang);
            }}
          >
            {lang.toUpperCase()}
          </S.Item>
        ))}
      </S.Container>
    );
  }
);
