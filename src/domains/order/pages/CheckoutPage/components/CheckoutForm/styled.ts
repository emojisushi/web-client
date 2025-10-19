import styled from "styled-components";
import { theme } from "styled-tools";

const Container = styled.div`
  width: 350px;
`;

const Form = styled.form`
  width: 100%;
`;

const ErrorBag = styled.ol`
  background: ${({ theme }) => theme.colors.danger.canvas};
  box-shadow: ${({ theme }) => theme.shadows.canvasShadow};
  border-radius: ${({ theme }) => theme.borderRadius.smooth};
  padding: 12px 12px 12px 28px;

  li {
    margin-top: 8px;

    :first-child {
      margin-top: 0;
    }
  }
`;

const Control = styled.div`
  margin-top: 20px;
`;

const Button = styled.button`
  color: rgb(255, 230, 0);
  font-size: 10px;
  right: 0;
  top: calc(100% + 2px);
  position: absolute;
  cursor: pointer;
`;

const Total = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
`;

const Login = styled.div`
  color: ${theme("colors.brand")};
  margin-left: 5px;
  cursor: pointer;
`;

export { Form, ErrorBag, Container, Button, Control, Total, Login };
