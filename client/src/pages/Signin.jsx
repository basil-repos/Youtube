import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { auth, provider } from "../firebase"
import { signInWithPopup } from "firebase/auth"
import { axiosInstance } from "../config";
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';

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

const Form = styled.form`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    gap: 20px;
`

const Signin = () => {
    const [type, setType] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState({
        login: null,
        register: null
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setErrorMsg((prev) => {
            return {...prev, login: null}
        });
        dispatch(loginStart());
        try {
            const res = await axiosInstance.post('/auth/signin', { name, password });
            dispatch(loginSuccess(res.data));
            navigate("/");
        } catch (error) {
            setErrorMsg((prev) => {
                return {...prev, login: error.response.data.message}
            });
            dispatch(loginFailure());
        }
    }

    const signInWithGoogle = async () => {
        dispatch(loginStart());
        signInWithPopup(auth, provider).then((result) => {
            axiosInstance.post('/auth/google', {
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

    const handleRegister = async (e) => {
        e.preventDefault();

        setErrorMsg((prev) => {
            return {...prev, register: null}
        });
        dispatch(loginStart());
        try {
            const res = await axiosInstance.post('/auth/signup', { name, email, password });
            dispatch(loginSuccess(res.data));
            navigate("/");
        } catch (error) {
            setErrorMsg((prev) => {
                return {...prev, register: error.response.data.message}
            });
            dispatch(loginFailure());
        }
    }

    return (
        <Container type={type}>
            <LoginWrapper type={type}>
                {errorMsg.login && <Alert variant="outlined" severity="error" style={{ width: '100%' }}>{errorMsg.login}</Alert>}
                <Title>Sign in</Title>
                <Form onSubmit={handleLogin}>
                    <Input placeholder="username" onChange={(e) => setName(e.target.value)} />
                    <Input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit">Signin</Button>
                </Form>
                <Button onClick={signInWithGoogle}>Signin with Google</Button>
                <SubTitle onClick={() => setType('register')}>Not a member?Signup now</SubTitle>
            </LoginWrapper>
            <RegisterWrapper type={type}>
                <Title>Signup</Title>
                <Input placeholder="username" onChange={(e) => setName(e.target.value)} />
                <Input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                <Button onClick={handleRegister}>Signup</Button>
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