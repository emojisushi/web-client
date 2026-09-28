import styled from "styled-components";
import media from "~common/custom-media";
import { BonusHistoryStatus } from "@layerok/emojisushi-js-sdk";

const List = styled.div`
  width: 634px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  ${media.lessThan("pc")`
    width: 350px;
  `}
`;

const Item = styled.div`
  background: ${({ theme }) => theme.colors.canvas.inset2};
  box-shadow: ${({ theme }) => theme.shadows.canvasInset2Shadow};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const Date = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.fg.muted};
`;

const OrderId = styled.div`
  margin-top: 2px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.fg.muted};
`;

const Right = styled.div`
  text-align: right;
  flex-shrink: 0;
`;

const Delta = styled.div<{ $refunded?: boolean }>`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme, $refunded }) =>
    $refunded ? theme.colors.fg.muted : theme.colors.fg.default};
  text-decoration: ${({ $refunded }) => ($refunded ? "line-through" : "none")};
`;

const Balance = styled.div`
  margin-top: 2px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.fg.muted};
`;

const StatusLabel = styled.div<{ $status: BonusHistoryStatus }>`
  margin-top: 4px;
  font-size: 12px;
  color: ${({ theme, $status }) =>
    $status === "applied"
      ? theme.colors.warning.fg
      : $status === "refunded"
      ? theme.colors.fg.muted
      : theme.colors.fg.default};
`;

export { List, Item, Date, OrderId, Right, Delta, Balance, StatusLabel };
