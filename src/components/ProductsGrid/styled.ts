import styled from "styled-components";
import { media } from "~common/custom-media";

export const Grid = styled.div`
  display: grid;
  column-gap: 30px;
  row-gap: 30px;
  grid-template-columns: 1fr 1fr 1fr;

  ${media.lessThan("pc")`
    grid-template-columns: 1fr 1fr;
    width: 541px;
    margin: 30px auto 0;
  `}

  ${media.lessThan("tablet")`
    width: 100%;
    grid-template-columns: 1fr;
  `}
`;

export const Title = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  text-transform: uppercase;

  ${media.lessThan("pc")`
    margin-left: 96px;
  `}
  ${media.lessThan("tablet")`
  margin-left: 0;
  `}
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 10px;

  ${media.lessThan("pc")`
    margin-top: 30px;
  `}
`;

export const Controls = styled.div`
  display: flex;
  ${media.lessThan("pc")`
    display: none;
  `}
`;

export const Root = styled.div`
  position: relative;
`;
