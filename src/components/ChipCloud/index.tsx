import * as S from "./styled";
import Skeleton from "react-loading-skeleton";
import { ReactNode } from "react";

type TChip = {
  label: string;
  key: string;
};

type TChipCloudProps = {
  items?: TChip[];
  loading?: boolean;
  children?: ReactNode;
};

type TCategoryProps = {
  loading?: boolean;
  item?: TChip;
  children?: ReactNode;
  isActive?: boolean;
  skeletonWidth?: number;
};

const ChipCloud = ({ children }: TChipCloudProps) => {
  return (
    <S.Chips>
      <S.Container>{children}</S.Container>
    </S.Chips>
  );
};

export const Chip = ({
  loading = false,
  children,
  isActive = false,
  skeletonWidth = 100,
}: TCategoryProps) => {
  return (
    <S.ChipContainer>
      {loading ? (
        <Skeleton borderRadius={5} height={40} width={skeletonWidth} />
      ) : (
        <S.Chip isActive={isActive}>{children}</S.Chip>
      )}
    </S.ChipContainer>
  );
};

export { ChipCloud };
