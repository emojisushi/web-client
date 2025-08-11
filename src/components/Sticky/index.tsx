import { cloneElement, forwardRef } from "react";
import { useTheme } from "styled-components";

export const Sticky = forwardRef(
  ({ children, show, top, right, bottom, left, style }: any, ref) => {
    const theme = useTheme();
    return (
      <div
        style={{
          position: "fixed",
          display: show ? "block" : "none",
          zIndex: theme.zIndices.sticky,
          top,
          right,
          bottom,
          left,
          ...style,
        }}
      >
        {cloneElement(children, { ref })}
      </div>
    );
  }
);
