import styled from "styled-components";
import { media } from "~common/custom-media";

const BackButton = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.fg.muted};
  width: fit-content;

  :hover {
    color: ${({ theme }) => theme.colors.brand};
  }
`;

const Grid = styled.div`
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;

  ${media.lessThan("pc")`
    grid-template-columns: 1fr;
    gap: 30px;
  `}
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 20px;
  line-height: 24px;
  text-align: center;
`;

const HorizontalBar = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border.darker};
  margin-top: 15px;
`;

const Image = styled.img`
  margin-top: 15px;
  width: 100%;
  height: 220px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  object-fit: cover;

  ${media.lessThan("pc")`
    height: 260px;
  `}
`;

const Content = styled.div`
  margin-top: 15px;
  line-height: 1.7;

  img {
    max-width: 100%;
    border-radius: ${({ theme }) => theme.borderRadius.default};
    display: block;
  }
`;

const Empty = styled.p`
  margin-top: 30px;
  color: ${({ theme }) => theme.colors.fg.muted};
  text-align: center;
`;

export { BackButton, Grid, Card, Title, HorizontalBar, Image, Content, Empty };
