import * as S from "./styled";
import { NavLink as BaseNavLink } from "react-router-dom";

export function NavLink({ children, to, ...props }) {
  return (
    <BaseNavLink
      style={{
        textDecoration: "none",
      }}
      to={to}
    >
      {({ isActive }) => (
        <S.Link isActive={isActive} end={true} {...props}>
          {children}
        </S.Link>
      )}
    </BaseNavLink>
  );
}
