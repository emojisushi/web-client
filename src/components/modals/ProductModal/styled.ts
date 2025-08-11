import styled from "styled-components";
import media from "~common/custom-media";

const Wrapper = styled.div`
  padding: 40px;
  width: 620px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${media.lessThan("tablet")`
    margin: 0;
    width: 100dvw;
    height: 100dvh;
  `};
`;

const TopWrapper = styled.div`
  display: flex;

  ${media.lessThan("tablet")`
    flex-direction: column;
  `}
`;

const Image = styled.div`
  width: 160px;
  height: 160px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  flex-shrink: 0;

  ${media.lessThan("tablet")`
    width: 100%;
    height: 280px;
  `}
`;

const BotWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 30px;
  position: relative;
  bottom: 0;
  height: 50px;
`;

const ProductName = styled.div`
  font-size: 22px;
  font-weight: 600;
  line-height: 27px;
  text-align: left;
  text-transform: uppercase;

  ${media.lessThan("tablet")`
    padding-top: 30px;
  `}
`;
const Description = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  text-align: left;
  padding-top: 10px;
`;

const DescriptionWrapper = styled.div`
  margin-left: 30px;
  flex-grow: 1;
  position: relative;
  padding-bottom: 58px;
  ${media.lessThan("tablet")`
    margin-left: 0px;
  `}
`;

const CartButton = styled.button`
  height: 50px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.brand};
  border-radius: 10px;

  font-size: 15px;
  font-weight: 600;
  :hover {
    background: ${({ theme }) => theme.colors.brand};
    color: black;
  }
`;

const ProductPrice = styled.div`
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const CloseIcon = styled.div`
  position: absolute;
  cursor: pointer;
  right: -40px;
  top: 0;

  ${media.lessThan("tablet")`
    top: 16px;
    right: 16px;
  `}
`;

export {
  Wrapper,
  TopWrapper,
  BotWrapper,
  Image,
  ProductName,
  Description,
  DescriptionWrapper,
  CartButton,
  ProductPrice,
  CloseIcon,
};
