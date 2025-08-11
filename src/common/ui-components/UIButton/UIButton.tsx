import { FlexBox, SvgIcon } from "~components";
import { forwardRef, HTMLProps, PropsWithChildren } from "react";

type UIButtonProps = PropsWithChildren<
  HTMLProps<HTMLDivElement> & {
    text: string;
  }
>;

export const UIButton = forwardRef<HTMLDivElement, UIButtonProps>(
  (props, ref) => {
    const { text, children, style, as, ...rest } = props;
    return (
      <FlexBox
        alignItems={"center"}
        style={{
          cursor: "pointer",
          ...style,
        }}
        {...rest}
        ref={ref}
      >
        <SvgIcon color={"white"} width={"25px"}>
          {children}
        </SvgIcon>
        <div style={{ marginLeft: "10px" }}>{text}</div>
      </FlexBox>
    );
  }
);
