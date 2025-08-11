import { SvgIcon } from "../SvgIcon";
import { EyeSvg } from "../svg/EyeSvg";
import { forwardRef, useState } from "react";
import { ClosedEyeSvg } from "../svg/ClosedEyeSvg";
import { IInputComponentProps, Input } from "../Input";
import { EndAdornment } from "~common/ui-components/EndAdornment";

type IProps = IInputComponentProps & {
  name: string;
  hidden?: boolean;
};

export const PasswordInput = forwardRef<HTMLInputElement, IProps>(
  ({ hidden: hiddenPassed = true, name, ...rest }, ref) => {
    const [hidden, setHidden] = useState(hiddenPassed);

    return (
      <Input
        name={name}
        type={hidden ? "password" : "text"}
        {...rest}
        ref={ref}
        endAdornment={
          <EndAdornment
            style={{
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.preventDefault();
              setHidden(!hidden);
            }}
          >
            <SvgIcon clickable={true} width="20px">
              {hidden ? <ClosedEyeSvg /> : <EyeSvg />}
            </SvgIcon>
          </EndAdornment>
        }
      />
    );
  }
);
