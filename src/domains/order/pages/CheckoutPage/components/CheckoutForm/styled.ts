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

const CallCenterSection = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  border: 1px solid rgba(255, 230, 0, 0.12);
  background: linear-gradient(
    135deg,
    rgba(255, 230, 0, 0.05) 0%,
    rgba(255, 230, 0, 0.01) 100%
  );
`;

const CallCenterSectionTitle = styled.p`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${theme("colors.brand")};
`;

type IssueVariant = "danger" | "warning";

const issueRgb: Record<IssueVariant, string> = {
  danger: "205, 56, 56",
  warning: "255, 230, 0",
};

const IssueBox = styled.div<{ $variant: IssueVariant }>`
  padding: 15px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  border: 1px solid rgba(${({ $variant }) => issueRgb[$variant]}, 0.35);
  background: linear-gradient(
    135deg,
    rgba(${({ $variant }) => issueRgb[$variant]}, 0.12) 0%,
    rgba(${({ $variant }) => issueRgb[$variant]}, 0.03) 100%
  );
  font-size: 15px;
  line-height: 20px;
`;

const IssueTitle = styled.p<{ $variant: IssueVariant }>`
  font-weight: 600;
  color: ${({ $variant, theme }) =>
    $variant === "danger" ? theme.colors.red[500] : theme.colors.brand};
`;

const IssueList = styled.ul`
  margin-top: 10px;
  padding-left: 20px;

  li + li {
    margin-top: 6px;
  }
`;

export {
  IssueBox,
  IssueTitle,
  IssueList,
  Form,
  ErrorBag,
  Container,
  Button,
  Control,
  Total,
  Login,
  CallCenterSection,
  CallCenterSectionTitle,
};
