import {
  createContext,
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  useContext,
  useId,
} from "react";
import {
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  FloatingPortal,
  FloatingOverlay,
} from "@floating-ui/react";
import styled, { useTheme } from "styled-components";
import { media } from "~common/custom-media";
import { Times } from "~assets/ui-icons";
import { SvgIcon } from "~components";

export type IModalProps = {
  open?: boolean;
  overlayStyles?: CSSProperties;
  children: ReactNode;
  onClose?: () => void;
  onOpenChange?: (state: boolean) => void;
};

type ModalContextValue = {
  close: () => void;
};

const ModalContext = createContext<ModalContextValue>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must used within ModalProvider");
  }
  return context;
};

const ModalProvider = ({
  children,
  value,
}: PropsWithChildren<{
  value: ModalContextValue;
}>) => {
  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const Modal = ({
  children,
  overlayStyles,
  open = false,
  onOpenChange,
  onClose,
}: IModalProps) => {
  const theme = useTheme();
  const setOpen = (state: boolean) => {
    if (!state) {
      onClose?.();
    }
    onOpenChange?.(state);
  };

  const { context, refs } = useFloating({
    open,
    onOpenChange: setOpen,
  });

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const { getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context),
  ]);

  const closeModal = () => setOpen(false);

  return (
    <FloatingPortal>
      <ModalProvider
        value={{
          close: closeModal,
        }}
      >
        {open && (
          <FloatingOverlay
            lockScroll
            style={{
              display: "grid",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(0, 0, 0, 0.4)",
              zIndex: theme.zIndices.modals,
              ...overlayStyles,
            }}
          >
            <div
              {...getFloatingProps({
                ref: refs.setFloating,
                "aria-labelledby": labelId,
                "aria-describedby": descriptionId,
              })}
            >
              {children}
            </div>
          </FloatingOverlay>
        )}
      </ModalProvider>
    </FloatingPortal>
  );
};

export const ModalContent = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.canvas.inset2};
  box-shadow: ${({ theme }) => theme.shadows.canvasInset2Shadow};
  border-radius: ${({ theme }) => theme.borderRadius.default};
`;

export const ModalCloseButton = () => {
  const theme = useTheme();
  const { close } = useModal();
  return (
    <ModalCloseButtonContainer>
      <SvgIcon
        onClick={close}
        hoverColor={theme.colors.brand}
        color={"white"}
        style={{
          cursor: "pointer",
          width: 35,
        }}
      >
        <Times />
      </SvgIcon>
    </ModalCloseButtonContainer>
  );
};

export const ModalCloseButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: -35px;
  cursor: pointer;

  ${media.lessThan("pc")`
    right: 10px;
    top: 10px;
  `}
`;
