import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  padding: 20px;
  width: 350px;
`;

const Title = styled.p`
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  margin-bottom: 20px;
`;

const Form = styled.form`
  user-select: none;
  width: 100%;
`;

const ForgotPassText = styled.p`
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.fg.default};

  margin-bottom: 20px;
  margin-top: 10px;
`;

const BtnGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export { Title, Wrapper, Form, ForgotPassText, BtnGroup };
