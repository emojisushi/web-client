import { useTheme } from "styled-components";

export const CheckSvg = () => {
  const theme = useTheme();
  return (
    <svg
      width="15"
      height="12"
      viewBox="0 0 15 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.875 1.625L5.125 10.375L0.75 6"
        stroke={theme.colors.brand}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
