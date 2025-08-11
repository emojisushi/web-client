import styled from "styled-components";
import media from "~common/custom-media";

const Locations = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 60px 0;
  padding-bottom: 100px;
  min-height: 100vh;

  ${media.lessThan("tablet")`
    padding: 50px 0;
  `}
`;

const LogoWrapper = styled.div`
  width: 255px;
  ${media.greaterThan("mobile")`
    width: 160px;
  `}
`;

const MapWrapper = styled.div`
  width: 20px;
  ${media.greaterThan("mobile")`
    width: "25px";
  `}
`;

const LocationsContainer = styled.div`
  margin: 0 auto;
  max-width: calc(598px + 24px);
  width: 100%;
  padding: 0 12px;
`;

const LocationsHead = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  margin-bottom: 50px;
  gap: 30px;

  ${media.lessThan("mobile")`
    margin-bottom: 60px;
  `}
`;

const LocationsLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.fg.default};

  ${media.lessThan("mobile")`
    font-size: 1rem;
    line-height: 1.25rem;
  `}
`;

const LocationsBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export {
  Locations,
  LocationsBody,
  LocationsHead,
  LocationsLabel,
  LocationsContainer,
  LogoWrapper,
  MapWrapper,
};
