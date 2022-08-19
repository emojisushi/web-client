import styled from "styled-components";

const Heading = styled.p`
  font-weight: 600;
  font-size: 25px;
  line-height: 30px;

  color: #FFFFFF;
`

const Form = styled.form`
    margin-top: 12px;
    width: 285px;
`

const Text = styled.p`
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  color: #616161;
  margin-top: 20px;
  :first-child{
    margin-top: 0;
  }
`

const ButtonWrapper = styled.div`
  margin-top: 20px;
`

export {
    Heading,
    Form,
    Text,
    ButtonWrapper,

}
