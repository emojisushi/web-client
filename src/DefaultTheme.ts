// import original module declarations
import { DefaultTheme } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      grey: {
        300: string;
        450: string;
        510: string;
        571: string;
      };
      red: {
        500: string;
      };
      brand: string;
      brandDelimiter: string;
      ukrainianFlag: {
        sky: string;
        wheat: string;
      };
      fg: {
        default: string;
        muted: string;
        brandContrast: string;
      };
      danger: {
        canvas: string;
      };
      warning: {
        fg: string;
      };
      canvas: {
        default: string;
        inset: string;
        inset2: string;
        inset3: string;
        inset4: string;
        inset5: string;
      };
      border: {
        default: string;
        darker: string;
      };
      skeleton: {
        baseColor: string;
        highlightColor: string;
      };
    };
    borderRadius: {
      default: string;
      smooth: string;
      lessSmooth: string;
      almostSquare: string;
    };
    shadows: {
      brand: string;
      brandSofter: string;
      canvasShadow: string;
      canvasInset2Shadow: string;
      canvasInsetShadow: string;
    };

    zIndices: {
      popovers: number;
      dropdowns: number;
      modals: number;
      sticky: number;
      tooltips: number;
      preloader: number;
      overModal: number;
    };

    components: {
      input: {
        placeholder: string;
      };
    };

    gradients: {
      fade: string;
    };
  }
}
