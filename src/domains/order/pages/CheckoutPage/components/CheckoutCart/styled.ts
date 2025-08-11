import styled from "styled-components";
import media from "~common/custom-media";

const Wrapper = styled.div`
  width: 540px;

  ${media.lessThan("pc")`
    width: 350px;
  `}

  ${media.lessThan("tablet")`
    margin-top: 30px;
    margin-bottom: 50px;
  `}
`;

const Inner = styled.div`
  position: sticky;
  top: 30px;
`;

const Items = styled.div`
  max-height: 426px;
  overflow-y: auto;
`;

const EditButton = styled.div`
  margin-top: 20px;
`;

export { Wrapper, EditButton, Items, Inner };
