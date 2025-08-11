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
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "styled-components";

export const AnimatedTooltip = ({
  children,
  label,
  placement = "top",
}: {
  label: ReactElement;
  placement: Placement;
  children: ReactElement;
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const { x, y, refs, strategy, context } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [offset(5), flip(), shift({ padding: 8 })],
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { restMs: 40 }),
    useFocus(context),
    useRole(context, { role: "tooltip" }),
    useDismiss(context),
  ]);

  return (
    <>
      {cloneElement(
        children as ReactElement,
        getReferenceProps({ ref: refs.setReference, ...children.props })
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            {...getFloatingProps({
              ref: refs.setFloating,
              className: "Tooltip",
              style: {
                zIndex: theme.zIndices.tooltips,
                position: strategy,
                top: y ?? "",
                left: x ?? "",
              },
            })}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
