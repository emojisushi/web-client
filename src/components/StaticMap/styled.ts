import styled from "styled-components";
import { prop } from "styled-tools";
import OdessaMapSrc from "../../assets/img/odessa-map.png";
import { CSSProperties } from "react";

const Background = styled.div<{
  width: CSSProperties["width"];
  height: CSSProperties["height"];
  topRight: CSSProperties["borderTopRightRadius"];
  topLeft: CSSProperties["borderTopLeftRadius"];
  bottomRight: CSSProperties["borderBottomRightRadius"];
  bottomLeft: CSSProperties["borderBottomLeftRadius"];
}>`
  background-image: url(${OdessaMapSrc});
  display: flex;
  justify-content: center;
  align-items: center;
  background-position: center;
  overflow: hidden;
  width: ${prop("width")};
  height: ${prop("height")};
  border-top-right-radius: ${prop("topRight")};
  border-top-left-radius: ${prop("topLeft")};
  border-bottom-left-radius: ${prop("bottomLeft")};
  border-bottom-right-radius: ${prop("bottomRight")};
  cursor: pointer;
`;

const MapText = styled.div`
  margin-left: 10px;
`;
export { Background, MapText };
