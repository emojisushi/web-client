import { addAlphaToHexadecimal } from "~utils/addAlphaToHexadecimal";
import { DefaultTheme } from "styled-components";

const palette = {
  white: "#ffffff",
  black: "#000000",
  yellow: {
    400: "#f1da00",
    500: "#ffe600",
  },
  orange: {
    500: "#d78403",
  },
  red: {
    500: "#cd3838",
  },
  grey: {
    300: "#6A6A6A",
    400: "#616161",
    450: "#4A4A4A",
    500: "#343434",
    510: "#333333",
    550: "#2F2F2F",
    560: "#2d2d2d",
    570: "#272727",
    571: "#262626",
    573: "#242424",
    575: "#222222",
    600: "#1F1F1F",
    700: "#1C1C1C",
    800: "#171717",
    900: "#141414",
  },
} as const;

const ukrainianFlag = {
  sky: "#3459DD",
  wheat: "#ffe600",
};

const components = {
  input: {
    placeholder: palette.grey[400],
  },
};

const colors = {
  ...palette,
  brand: palette.yellow[500],
  brandDelimiter: palette.yellow[400],
  ukrainianFlag: ukrainianFlag,
  fg: {
    default: palette.white,
    muted: palette.grey[400],
    brandContrast: palette.black,
  },
  danger: {
    canvas: palette.red[500],
  },
  canvas: {
    default: palette.grey[900],
    inset: palette.grey[800],
    inset2: palette.grey[700],
    inset3: palette.grey[500],
    inset4: palette.grey[570],
    inset5: palette.grey[573],
  },
  warning: {
    fg: palette.orange[500],
  },
  border: {
    default: palette.grey[500],
    darker: palette.grey[560],
  },
  skeleton: {
    baseColor: palette.grey[600],
    highlightColor: palette.grey[550],
  },
};

const shadows = {
  brand: `0 0 15px ${addAlphaToHexadecimal(palette.yellow[500], 50)}`,
  brandSofter: `0 0 15px ${addAlphaToHexadecimal(palette.yellow[500], 30)}`,
  canvasShadow: `0 0 15px ${addAlphaToHexadecimal(palette.grey[575], 30)}`,
  canvasInset2Shadow: `0 4px 15px ${addAlphaToHexadecimal(
    palette.grey[700],
    30
  )}`,
  canvasInsetShadow: `0 4px 15px ${addAlphaToHexadecimal(
    palette.grey[800],
    40
  )}`,
};

const gradients = {
  fade: `linear-gradient(270deg,${
    palette.grey[700]
  } 0%, ${addAlphaToHexadecimal(palette.grey[700], 0)} 100%)`,
};

const borderRadius = {
  default: "15px",
  smooth: "10px",
  lessSmooth: "5px",
  almostSquare: "3px",
};

const zIndices = {
  popovers: 999,
  modals: 999_999,
  dropdowns: 400,
  overModal: 1_000_000,
  sticky: 999,
  tooltips: 500,
  preloader: 99_999_999,
};

export const theme: DefaultTheme = {
  colors,
  shadows,
  gradients,
  components,
  borderRadius,
  zIndices,
};
