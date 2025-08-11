import * as S from "./styled";
import { ChangeEvent, HTMLProps, useId, forwardRef } from "react";
import { SkeletonWrap } from "~components";
import { ReactComponent as Checkmark } from "./checkmark.svg";
import { useTheme } from "styled-components";

type SegmentedControlProps = Omit<
  HTMLProps<HTMLDivElement>,
  "onChange" | "name"
> & {
  items: Item[];
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string | number | null;
  showSkeleton?: boolean;
};

export const SegmentedControl = forwardRef<
  HTMLDivElement,
  SegmentedControlProps
>((props, ref) => {
  const {
    items = [],
    name,
    onChange,
    value,
    showSkeleton = false,
    as,
    ...rest
  } = props;
  return (
    <SkeletonWrap
      style={{
        width: "100%",
      }}
      loading={showSkeleton}
    >
      <S.Wrapper {...rest} ref={ref}>
        {items.map((option, index) => (
          <Segment
            item={option}
            length={items.length}
            index={index}
            name={name}
            onChange={onChange}
            selected={option.value === value}
            key={index}
          />
        ))}
      </S.Wrapper>
    </SkeletonWrap>
  );
});

type Item = {
  value: number | string;
  label: string;
};

const Segment = (props: {
  item: Item;
  index: number;
  length: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selected: boolean;
  name: string;
}) => {
  const { item, index, length, onChange, selected, name } = props;

  const theme = useTheme();
  const internal_id = useId();

  const isFirstOption = index === 0;
  const isLastOption = length - 1 === index;

  const firstOptionStyles = {
    borderTopLeftRadius: theme.borderRadius.smooth,
    borderBottomLeftRadius: theme.borderRadius.smooth,
  };

  const lastOptionStyles = {
    borderTopRightRadius: theme.borderRadius.smooth,
    borderBottomRightRadius: theme.borderRadius.smooth,
  };

  return (
    <>
      <S.Input
        length={Math.max(1, length)}
        index={index}
        id={internal_id}
        value={item.value}
        type={"radio"}
        name={name}
        checked={selected}
        onChange={onChange}
      />
      <S.Label
        $selected={selected}
        style={{
          ...(isFirstOption && firstOptionStyles),
          ...(isLastOption && lastOptionStyles),
        }}
        htmlFor={internal_id}
      >
        {item.label}
      </S.Label>
    </>
  );
};
