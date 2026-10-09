import * as S from "./styled";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { userBonusHistoryQuery } from "~domains/order/bonus.query";

export const BonusHistoryPage = () => {
  const { t } = useTranslation();

  const { data: history, isLoading } = useQuery(userBonusHistoryQuery);

  if (isLoading) {
    return null;
  }

  if (!history?.length) {
    return (
      <div style={{ marginTop: 20 }}>
        <p>{t("account.bonusHistory.noHistory")}</p>
      </div>
    );
  }

  return (
    <S.List>
      {history.map((item) => (
        <S.Item key={item.id}>
          <div>
            <S.Date>
              {new Date(item.date).toLocaleString("uk-UA", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </S.Date>
            {!!item.order_id && (
              <S.OrderId>
                {t("account.bonusHistory.order", { id: item.order_id })}
              </S.OrderId>
            )}
          </div>
          <S.Right>
            <S.Delta $refunded={item.refunded}>
              {Math.floor(item.delta / 100)} ₴
            </S.Delta>
            <S.Balance>
              {t("account.bonusHistory.balanceAfter", {
                amount: Math.floor(item.balance_after / 100),
              })}
            </S.Balance>
            <S.StatusLabel $status={item.status}>
              {item.refunded
                ? t("account.bonusHistory.refunded")
                : t(`account.bonusHistory.status.${item.status}`)}
            </S.StatusLabel>
          </S.Right>
        </S.Item>
      ))}
    </S.List>
  );
};

export const Component = BonusHistoryPage;
Object.assign(Component, {
  displayName: "LazyBonusHistoryPage",
});
