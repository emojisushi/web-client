import styled, { css } from "styled-components";
import { ifProp } from "styled-tools";
import { media } from "~common/custom-media";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 540px;
  ${media.lessThan("tablet")`
    width: 350px;
  `};
`;

const Text = styled.p`
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
`;

const FilterMagnifier = styled.div`
  display: flex;
  align-items: center;
`;

const Content = styled.div`
  padding-top: 20px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Item = styled.div<{
  selected: boolean;
}>`
  margin-top: 15px;
  font-size: 15px;
  line-height: 18px;

  ${ifProp(
    "selected",
    css`
      font-weight: 500;
      color: ${(props) => props.theme.colors.brand};
    `
  )}
  cursor: pointer
`;

export { Wrapper, Text, FilterMagnifier, Content, Item };
