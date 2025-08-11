import styled from "styled-components";
import media from "src/common/custom-media";

const Category = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 50px;

  ${media.lessThan("mobile")`
   padding-top: 10px;
   padding-bottom: 60px;
  `}
`;

const CategoryContainer = styled.div`
  margin: 0 auto;
  max-width: 700px;
  width: 100%;
  padding: 0 12px;
`;

const CategoryLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  gap: 10px;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.fg.default};

  ${media.lessThan("mobile")`
    font-size: 16px;
    line-height: 20px;
  `}
`;

const CategoryItems = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const CategoryList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;

  ${media.lessThan("tablet")`
      flex-direction: column;
      gap: 15px;
    `}
`;

const IconWrapper = styled.div`
  width: 25px;
  ${media.lessThan("tablet")`
width: 20px;
`}
`;

export {
  Category,
  CategoryList,
  CategoryItems,
  CategoryLabel,
  CategoryContainer,
  IconWrapper,
};
