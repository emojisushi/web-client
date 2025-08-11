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

const CheckboxWrapper = styled.div`
  margin-top: 10px;
  margin-bottom: 24px;
`;

export { Title, Wrapper, Form, CheckboxWrapper };
