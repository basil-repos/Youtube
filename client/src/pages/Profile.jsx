import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components"
import { useRef, useState } from "react";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import app from "../firebase";
import { axiosInstance } from "../config";
import { updateUser } from "../redux/userSlice";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 40px;
`

const Avatar = styled.img`
    width: 230px;
    height: 230px;
    border-radius: 50%;
    background-color: #999;
`;

const UploadWrapper = styled.div`
    transform: translate(60px, -50px);
`

const UploadIcon = styled.div`
    color: ${({ theme }) => theme.textSoft};
`

const DetailsWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: ${({ theme }) => theme.bgLighter};
    border: 1px solid ${({ theme }) => theme.soft};
    padding: 30px 50px;
    gap: 10px;
    width: 30%;
    transform: translate(0px, -50px);
`;

const Form = styled.form`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    gap: 20px;
`

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
    cursor: ${({ loading }) => loading === 'true' ? 'not-allowed' : 'pointer'};
    background-color: ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.textSoft};
`;

const Profile = () => {
    const { currentUser } = useSelector(state => state.user);
    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(currentUser.img);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const fileUpload = useRef(null);
    const dispatch = useDispatch();

    const uploadFile = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime()+ "-" + file.name;
        const storageRef = ref(storage, currentUser._id + "/profile/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
    
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            setLoading(true);
            switch (snapshot.state) {
              case "paused":
                break;
              case "running":
                break;
              default:
                break;
            }
          },
          (error) => {},
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
                setImage(downloadURL);
                const res = await axiosInstance.put(`/users/${currentUser._id}`, {img: downloadURL});
                res.status === 200 && dispatch(updateUser(res.data));
                setLoading(false);
            });
          }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            const res = await axiosInstance.put(`/users/${currentUser._id}`, { name, email, password});
            if(res.status === 200){
                setLoading(false);
                dispatch(updateUser(res.data));
                setOpen(true);
                setTimeout(() => {
                    setOpen(false);
                }, 3000);
            }
        } catch (error) {
        }
    }

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    return (
        <Container>
            <Avatar src={image} />
            <input hidden accept="image/*" type="file" onChange={(e) => uploadFile(e.target.files[0])} ref={fileUpload} />
            <UploadWrapper>
                <UploadIcon>
                    <PhotoCameraIcon style={{ fontSize: '60px', cursor: 'pointer' }} onClick={() => fileUpload.current.click()} />
                </UploadIcon>
            </UploadWrapper>
            <DetailsWrapper>
                {loading === true && <Box sx={{ width: '100%', marginBottom: '10px' }}>
                    <LinearProgress />
                </Box>}
                <Form onSubmit={handleSubmit}>
                    <Input placeholder="username" value={name} onChange={(e) => setName(e.target.value)} />
                    <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit" loading={loading ? 'true' : 'false'}>Update</Button>
                </Form>
            </DetailsWrapper>
            <Snackbar 
                open={open}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                key={'bottom' + 4000}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Updated Successfully
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default Profile