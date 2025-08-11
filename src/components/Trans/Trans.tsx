import { Trans as TransBase } from "react-i18next";
import { SkeletonWrap } from "~components";

export const Trans = ({
  i18nKey,
  showSkeleton,
}: {
  i18nKey: string;
  showSkeleton?: boolean;
}) => {
  return (
    <SkeletonWrap loading={showSkeleton}>
      <TransBase i18nKey={i18nKey} />
    </SkeletonWrap>
  );
};
