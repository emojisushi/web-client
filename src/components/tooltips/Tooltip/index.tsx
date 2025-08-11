import { cloneElement, ReactElement, useState } from "react";
import {
  offset,
  flip,
  shift,
  useFloating,
  useInteractions,
  useHover,
  useFocus,
  useRole,
  useDismiss,
  Placement,
} from "@floating-ui/react";

export const Tooltip = ({
  children,
  label,
  placement = "top",
}: {
  children: ReactElement;
  label: ReactElement;
  placement: Placement;
}) => {
  const [open, setOpen] = useState(false);

  const { x, y, refs, strategy, context } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [offset(5), flip(), shift({ padding: 8 })],
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context),
    useFocus(context),
    useRole(context, { role: "tooltip" }),
    useDismiss(context),
  ]);

  return (
    <>
      {cloneElement(
        children,
        getReferenceProps({ ref: refs.setReference, ...children.props })
      )}
      {open && (
        <div
          {...getFloatingProps({
            ref: refs.setFloating,
            className: "Tooltip",
            style: {
              position: strategy,
              top: y ?? "",
              left: x ?? "",
            },
          })}
        >
          {label}
        </div>
      )}
    </>
  );
};
