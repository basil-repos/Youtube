import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { auth, provider } from "../firebase"
import { signInWithPopup } from "firebase/auth"

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
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();

        dispatch(loginStart());
        try {
            const res = await axios.post('/auth/signin', { name, password });
            dispatch(loginSuccess(res.data));
        } catch (error) {
            dispatch(loginFailure());
        }
    }

    const signInWithGoogle = async () => {
        dispatch(loginStart());
        signInWithPopup(auth, provider).then((result) => {
            axios.post('/auth/google', {
                name: result.user.displayName,
                email: result.user.email,
                img: result.user.photoURL
            }).then((res) => {
                dispatch(loginSuccess(res.data));
            });
        }).catch((err) => {
            dispatch(loginFailure());
        })
    }

    return (
        <Container type={type}>
            <LoginWrapper type={type}>
                <Title>Sign in</Title>
                <Input placeholder="username" onChange={(e) => setName(e.target.value)} />
                <Input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                <Button onClick={handleLogin}>Signin</Button>
                <Button onClick={signInWithGoogle}>Signin with Google</Button>
                <SubTitle onClick={() => setType('register')}>Not a member?Signup now</SubTitle>
            </LoginWrapper>
            <RegisterWrapper type={type}>
                <Title>Signup</Title>
                <Input placeholder="username" onChange={(e) => setName(e.target.value)} />
                <Input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
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