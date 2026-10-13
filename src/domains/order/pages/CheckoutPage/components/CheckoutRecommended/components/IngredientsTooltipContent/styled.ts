import styled from "styled-components";

const Wrapper = styled.div`
  width: 255px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  background: ${({ theme }) => theme.colors.canvas.inset3};
  box-shadow: ${({ theme }) => theme.shadows.canvasInset2Shadow};
  padding: 10px;
`;

const Title = styled.div``;

const List = styled.ul`
  margin-top: 15px;
  padding-left: 20px;
`;

const ListItem = styled.li`
  font-size: 13px;
  line-height: 16px;
  position: relative;

  :before {
    content: "";
    position: absolute;
    width: 2px;
    height: 2px;
    background: white;
    border-radius: 100%;
    top: 7px;
    left: -12px;
  }
`;

export { Wrapper, Title, List, ListItem };
