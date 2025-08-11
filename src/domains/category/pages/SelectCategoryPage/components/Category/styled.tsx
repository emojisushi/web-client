import styled from "styled-components";
import { theme } from "styled-tools";
import media from "~common/custom-media";
import { Link as LinkBase } from "react-router-dom";

const Image = styled.div`
  flex-shrink: 0;

  width: 100px;
  height: 100px;

  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:before {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.gradients.fade};
    pointer-events: none;
  }
`;

const Item = styled.li`
  width: calc(100% / 2 - 15px);

  ${media.lessThan("tablet")`
     width: 100%;
    `}
`;

const Link = styled(LinkBase)`
  padding-left: 20px;
  padding-right: 15px;
  background: ${({ theme }) => theme.colors.canvas.inset2};
  border-radius: ${({ theme }) => theme.borderRadius.smooth};

  transition: 0.3s;

  display: flex;
  align-items: center;

  border: 1px solid ${({ theme }) => theme.colors.canvas.inset2};

  gap: 34px;

  color: ${({ theme }) => theme.colors.fg.default};
  text-decoration: none;
  position: relative;

  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  text-transform: uppercase;

  span {
    display: inline-block;
    max-width: 101px;
    width: 100%;
  }

  &:hover {
    color: ${theme("colors.brand")};
  }
  &:active {
    border-color: ${theme("colors.brand")};
    color: ${theme("colors.brand")};
  }

  ${media.lessThan("mobile")`
        padding-right: 9px;
        justify-content: space-between;
        `}
`;

export { Image, Item, Link };
