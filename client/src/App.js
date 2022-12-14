import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import Signin from "./pages/Signin";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import History from "./pages/History";

const Container = styled.div`
    display: flex;
`

const Main = styled.div`
    flex: 10;
    background-color: ${({ theme }) => theme.bg};
`

const Wrapper = styled.div`
    padding: 22px 96px;
`

function App() {
    const [darkMode, setDarkMode] = useState(true);

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <Container>
                <BrowserRouter>
                    <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
                    <Main>
                        <Navbar />
                        <Wrapper>
                            <Routes>
                                <Route path="/">
                                    <Route index element={<Home type="random" />} />
                                    <Route path="trending" element={<Home type="trending" />} />
                                    <Route path="subscriptions" element={<Home type="subscribed" />} />
                                    <Route path="search" element={<Search />} />
                                    <Route path="profile" element={<Profile />} />
                                    <Route path="signin" element={<Signin />} />
                                    <Route path="history" element={<History />} />
                                    <Route path="video">
                                        <Route path=":id" element={<Video />} />
                                    </Route>
                                </Route>
                            </Routes>
                        </Wrapper>
                    </Main>
                </BrowserRouter>
            </Container>
        </ThemeProvider>
    );
}

export default App;
