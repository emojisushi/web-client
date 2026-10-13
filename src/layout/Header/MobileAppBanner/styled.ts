import styled from "styled-components";

export const Banner = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000;

  width: 100%;
  height: 65px;
  background: #1c1c1c;

  display: flex;
  align-items: center;
`;
export const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px 0 45px;
  box-sizing: border-box;
`;

export const CloseButton = styled.button`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);

  width: 18px;
  height: 18px;

  padding: 0;
  border: 0;
  background: transparent;

  color: #aaa;
  font-size: 34px;
  font-weight: 200;
  line-height: 20px;

  cursor: pointer;
`;

export const AppIcon = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 10px;
  }
`;

export const Text = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  min-width: 0;
`;

export const DownloadText = styled.span`
  color: #fff;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AppName = styled.span`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
`;

export const DownloadButton = styled.a`
  margin-left: auto;

  height: 38px;
  padding: 0 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #ffe600;
  border-radius: 3px;

  color: #000;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;

  &:active {
    transform: scale(0.98);
  }
`;
