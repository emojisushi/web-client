import React, { PropsWithChildren, ReactElement, useEffect } from "react";
import {
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useRole,
  useDismiss,
  useId,
  useClick,
  FloatingFocusManager,
  FloatingPortal,
  Placement,
} from "@floating-ui/react";
import { useTheme } from "styled-components";

export const Popover = ({
  children,
  render,
  placement,
  disable = false,
  offset: passedOffset = 0,
  open = false,
  onOpenChange = () => {},
}: PropsWithChildren<{
  disable?: boolean;
  render: (props: { labelId: string; descriptionId: string }) => ReactElement;
  placement?: Placement;
  offset?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}>) => {
  const { x, y, strategy, refs, update, context } = useFloating({
    open,
    onOpenChange: onOpenChange,
    middleware: [offset(passedOffset), flip(), shift()],
    placement,
  });

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context),
  ]);

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && open) {
      // todo: polyfill ResizeObserver
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [open, update, refs.reference, refs.floating]);

  const theme = useTheme();

  return (
    <>
      <div ref={refs.setReference}>{children}</div>
      <FloatingPortal root={document.querySelector("body")}>
        {open && !disable && (
          <FloatingFocusManager
            context={context}
            modal={false}
            order={["reference", "content"]}
            returnFocus={false}
          >
            <div
              {...getFloatingProps({
                className: "Popover",
                ref: refs.setFloating,
                style: {
                  position: strategy,
                  top: y ?? "",
                  left: x ?? "",
                  zIndex: theme.zIndices.overModal,
                },
                "aria-labelledby": labelId,
                "aria-describedby": descriptionId,
              })}
            >
              {render({
                labelId,
                descriptionId,
              })}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  );
};
