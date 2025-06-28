import styled from "styled-components";
import { prop } from "styled-tools";
import media from "~common/custom-media";

const Wrapper = styled.div`
  width: 420px;
  position: relative;
  background: ${({ theme }) => theme.colors.canvas.inset2};
  box-shadow: ${({ theme }) => theme.shadows.canvasInset2Shadow};
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.default};

  ${media.greaterThan("tablet")`
    min-height: 500px;
  `}

  ${media.lessThan("tablet")`
    border-radius: 0px;
    width: 100dvw;
    height: 100dvh;
  `}

  ${media.lessThan("tablet")`
    padding: 72px 20px 31px 20px;
  `}

  padding: 31px 20px 31px 20px;
  flex-direction: column;
  justify-content: space-between;
  display: flex;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  text-transform: uppercase;
`;

const CloseIcon = styled.div`
  position: absolute;
  left: -45px;
  top: 31px;
  cursor: pointer;

  ${media.lessThan("tablet")`
    top: 20px;
    right: 20px;
    left: auto;
    
  `}
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  position: relative;
  display: flex;
  padding-bottom: 20px;
  margin-top: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey[450]};

  &:first-child {
    margin-top: 0;
  }
`;

const ItemImg = styled.div<{
  src: string;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  background-image: url("${prop("src")}");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  flex-shrink: 0;
`;

const ItemInfo = styled.div`
  margin-left: 10px;
  width: 100%;
`;

const ItemName = styled.div`
  font-size: 15px;
  line-height: 18px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 220px;

  ${media.lessThan("tablet")`
    width: 186px;
  `}
`;

const ItemCounter = styled.div`
  margin-left: 20px;
  margin-top: 21px;
`;

const ItemRemoveIcon = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

const Footer = styled.div`
  margin-top: 30px;
`;

const Sum = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
`;

const Button = styled.div`
  margin-top: 37px;
`;

const EmptyCartImgContainer = styled.div`
  position: absolute;
  inset: 0;
  top: 50%;
  transform-origin: center;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export {
  Wrapper,
  Title,
  CloseIcon,
  Items,
  Item,
  ItemImg,
  ItemName,
  ItemRemoveIcon,
  ItemInfo,
  ItemCounter,
  Footer,
  Sum,
  Button,
  EmptyCartImgContainer,
};
