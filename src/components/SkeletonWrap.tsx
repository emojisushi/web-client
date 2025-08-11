import Skeleton from "react-loading-skeleton";
import { CSSProperties, PropsWithChildren, ReactNode } from "react";

const styles: Record<string, CSSProperties> = {
  container: {
    position: "relative",
    display: "inline-block",
  },
  skeletonWrapper: {
    position: "absolute",
    inset: 0,
  },
  content: {
    opacity: 0,
  },
};

export const SkeletonWrap = ({
  loading = false,
  borderRadius,
  children,
  style = {},
}: PropsWithChildren<{
  loading: boolean;
  children: ReactNode;
  borderRadius?: string | number;
  style?: CSSProperties;
}>) => {
  if (loading) {
    return (
      <span
        style={{
          ...styles.container,
          ...style,
        }}
      >
        <span style={styles.skeletonWrapper}>
          <Skeleton
            borderRadius={borderRadius}
            height={"100%"}
            width={"100%"}
          />
        </span>

        <span style={styles.content}>{children}</span>
      </span>
    );
  }
  return <>{children}</>;
};
