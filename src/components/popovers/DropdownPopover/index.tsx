import * as S from "./styled";
import { Popover } from "../Popover";
import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "styled-components";

type Option = {
  id: string;
  name: string;
};

export type DropdownPopoverOption = Option;

type Props = {
  options?: Option[];
  offset?: number;
  open?: boolean;
  disable?: boolean;
  selectedIndex: number;
  children: ReactNode | { (props: { selectedOption?: Option }): ReactNode };
  backgroundColor?: string;
  width?: string;
  onSelect?: (props: { option: Option; index: number }) => void;
};

export function DropdownPopover(props: Props) {
  const theme = useTheme();
  const {
    onSelect = () => {},
    options = [],
    offset = 0,
    open: initialOpen = false,
    disable = false,
    selectedIndex,
    children,
    backgroundColor = theme.colors.canvas.inset,
    width = "100%",
  } = props;
  const [open, setOpen] = useState(initialOpen);
  const [selectedOption, setSelectedOption] = useState(options[selectedIndex]);

  useEffect(() => {
    setSelectedOption(options[selectedIndex]);
  }, [selectedIndex, options]);

  const handleSelect = ({ option, index }) => {
    onSelect({ option, index });
    setOpen(false);
  };

  return (
    <>
      <Popover
        offset={offset}
        open={open}
        onOpenChange={setOpen}
        disable={disable}
        render={() => (
          <S.Options width={width} backgroundColor={backgroundColor}>
            {options.map((option, index) => (
              <S.Option
                onClick={() => handleSelect({ option, index })}
                key={option.id}
              >
                {option.name}
              </S.Option>
            ))}
          </S.Options>
        )}
      >
        <div onClick={() => setOpen(true)} style={{ cursor: "pointer", width }}>
          {/* @ts-ignore */}
          {typeof children === "function"
            ? children({ selectedOption })
            : children}
        </div>
      </Popover>
    </>
  );
}
