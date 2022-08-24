import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Upload from "./Upload";
import { useState } from "react";
import { axiosInstance } from "../config";
import { logout } from "../redux/userSlice";

const Container = styled.div`
    position: sticky;
    top: 0;
    background-color: ${({ theme }) => theme.bgLighter};
    height: 56px;
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    padding: 0px 20px;
    position: relative;
`;

const Search = styled.div`
    width: 40%;
    position: absolute;
    left: 0px;
    right: 0px;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
    width: 100%;
    border: none;
    background-color: transparent;
    outline: none;
    color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
    padding: 5px 15px;
    background-color: transparent;
    border: 1px solid #3ea6ff;
    color: #3ea6ff;
    border-radius: 3px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
`;

const User = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    color: ${({ theme }) => theme.text};
`;

const Avatar = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #999;
`;

const UserDetails = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
`

const Dropdown = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 56px;
    z-index: 1000;
    float: right;
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.bgLighter};
    border-radius: 5px;
    width: 180px;
`

const DropdownItem = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 30px;
    color: ${({ theme }) => theme.text};
    word-wrap: break-word;
    cursor: pointer;

    &:hover {
        background-color: ${({ theme }) => theme.textSoft};
        color: ${({ theme }) => theme.soft};
    }
`

const Navbar = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const [dropdown, setDropdown] = useState(false);
    const { currentUser } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const handleLogout = async () => {
        await axiosInstance.get('/auth/logout');
        dispatch(logout());
        setDropdown(false)
        navigate('/');
    }

    return (
        <>
            <Container>
                <Wrapper>
                    <Search>
                        <Input placeholder="Search" onChange={(e) => setQ(e.target.value)} />
                        <SearchOutlinedIcon onClick={()=>navigate(`/search?q=${q}`)} />
                    </Search>
                    {currentUser ? (
                        <>
                            <User>
                                <VideoCallOutlinedIcon onClick={() => setOpen(true)} style={{ cursor: "pointer" }} />
                                <UserDetails onClick={() => setDropdown(!dropdown)}>
                                    <Avatar src={currentUser.img} />
                                    {currentUser.name}
                                </UserDetails>
                            </User>
                            {dropdown && <Dropdown>
                                <DropdownItem>
                                    <PersonIcon />&nbsp;
                                    Profile
                                </DropdownItem>
                                <DropdownItem onClick={handleLogout}>
                                    <LogoutIcon />&nbsp;
                                    Logout
                                </DropdownItem>
                            </Dropdown>}
                        </>
                    ) : (
                    <Link to="signin" style={{ textDecoration: "none" }}>
                        <Button>
                            <AccountCircleOutlinedIcon />
                            SIGN IN
                        </Button>
                    </Link>
                    )}
                </Wrapper>
            </Container>
            {open && <Upload setOpen={setOpen} /> }
        </>
    )
}

export default Navbar