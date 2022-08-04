import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const LoginWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
  display: ${(props) => props.type === "register" && "none" };
  width: 40%;
`;

const RegisterWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
  display: ${(props) => props.type === "login" && "none"};
  width: 40%;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;

const SubTitle = styled.span`
  font-size: 10px;
  text-decoration: underline;
  cursor: pointer;
  color: #3ea6ff;
`;

const Signin = () => {
    const [type, setType] = useState("login");

    return (
        <Container type={type}>
            <LoginWrapper type={type}>
                <Title>Sign in</Title>
                <Input placeholder="username" />
                <Input type="password" placeholder="password" />
                <Button>Sign in</Button>
                <SubTitle onClick={() => setType('register')}>Not a member?Signup now</SubTitle>
            </LoginWrapper>
            <RegisterWrapper type={type}>
                <Title>Signup</Title>
                <Input placeholder="username" />
                <Input placeholder="email" />
                <Input type="password" placeholder="password" />
                <Button>Signup</Button>
                <SubTitle onClick={() => setType('login')}>Already have an account?</SubTitle>
            </RegisterWrapper>
            <More>
                English(USA)
                <Links>
                    <Link>Help</Link>
                    <Link>Privacy</Link>
                    <Link>Terms</Link>
                </Links>
            </More>
        </Container>
    )
}

export default Signin