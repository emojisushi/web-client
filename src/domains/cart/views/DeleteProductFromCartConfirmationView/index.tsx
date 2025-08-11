import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FlexBox } from "~components";
import { Button } from "~common/ui-components/Button/Button";

const Wrapper = styled.div`
  padding: 10px 10px 20px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  width: 355px;
  background-color: ${({ theme }) => theme.colors.canvas.inset5};
  color: ${({ theme }) => theme.colors.fg.default};
`;

export const DeleteProductFromCartConfirmationView = ({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      {t("cartModal.confirmProductDeletionView.title")}
      <FlexBox style={{ marginTop: "20px" }} justifyContent={"space-between"}>
        <Button
          skin={"default"}
          onClick={onCancel}
          style={{
            width: 162,
          }}
        >
          {t("cartModal.confirmProductDeletionView.cancel")}
        </Button>
        <Button skin={"danger"} onClick={onConfirm} style={{ width: 162 }}>
          {t("cartModal.confirmProductDeletionView.confirm")}
        </Button>
      </FlexBox>
    </Wrapper>
  );
};
