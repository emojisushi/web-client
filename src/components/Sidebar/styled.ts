import styled, { css } from "styled-components";
import { ifProp, theme } from "styled-tools";
import { Input as BaseInput, inputClasses } from "~components";
import { media } from "~common/custom-media";
import { STICKY_SIDEBAR_CONTAINER_OFFSET } from "~components/Sidebar/constants";

export const Favorite = styled.li`
  font-size: 16px;
  font-weight: 500;
  text-transform: uppercase;
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  padding-top: 28px;
  padding-bottom: 27px;
  margin-top: 30px;
  list-style: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  &:hover {
    color: ${theme("colors.brand")};
  }

  ${ifProp(
    "active",
    css`
      color: ${theme("colors.brand")};
    `
  )}
`;

export const Input = styled(BaseInput)`
  // remove the input outline, otherwise it will be chopped off by the sidebar container
  // which is not nice
  .${inputClasses.input}:focus {
    outline: none;
  }
`;

export const StickyContainer = styled.div`
  position: sticky;
  top: ${STICKY_SIDEBAR_CONTAINER_OFFSET}px;
  overflow: auto;
  max-height: calc(100vh - ${STICKY_SIDEBAR_CONTAINER_OFFSET * 2}px);
`;

export const Root = styled.aside`
  margin-bottom: 30px;
  flex-shrink: 0;
  ${media.lessThan("pc")`
    display: none;
  `}

  margin-right: 30px;
  width: 255px;
`;

export const SearchBarContainer = styled.div`
  margin-bottom: 0;
`;
