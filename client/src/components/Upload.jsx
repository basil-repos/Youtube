import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../config";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
`;

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const UploadButton = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const Label = styled.label`
  font-size: 14px;
`;

const Upload = ({ setOpen }) => {
    const [img, setImg] = useState(undefined);
    const [video, setVideo] = useState(undefined);
    const [imgPerc, setImgPerc] = useState(0);
    const [videoPerc, setVideoPerc] = useState(0);
    const [inputs, setInputs] = useState({});
    const [tags, setTags] = useState([]);
    const [fileType, setFileType] = useState('upload');
    const [loading, setLoading] = useState(false);

    const { currentUser } = useSelector(state => state.user);

    const navigate = useNavigate()

    const handleChange = (e) => {
        setInputs((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleTags = (e) => {
        setTags(e.target.value.split(","));
    };

    const uploadFile = (file, urlType) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime()+ "-" + file.name;
        const storageRef = ref(storage, currentUser._id + "/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
    
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            urlType === "imgUrl" ? setImgPerc(Math.round(progress)) : setVideoPerc(Math.round(progress));
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {},
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setInputs((prev) => {
                return { ...prev, [urlType]: downloadURL };
              });
            });
          }
        );
    };

    useEffect(() => {
        video && uploadFile(video , "videoUrl");
    }, [video]);

    useEffect(() => {
        img && uploadFile(img, "imgUrl");
    }, [img]);

    const handleUpload = async (e)=>{
        e.preventDefault();

        if(fileType === "url"){
            const videoType = "videoUrl";
            if(inputs[videoType].startsWith('https://www.youtube.com/watch') === true){
                const videoId = getVideoId(inputs[videoType]);
                setInputs((prev) => {
                    return { ...prev, [videoType]: 'https://www.youtube.com/embed/' + videoId };
                });
            }
        }
        setLoading(true);
        const res = await axiosInstance.post("/videos", {...inputs, tags})
        setLoading(false);
        setOpen(false)
        res.status===200 && navigate(`/video/${res.data._id}`)
    }

    function getVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
    
        return (match && match[2].length === 11)
          ? match[2]
          : null;
    }

    return (
        <Container>
            <Wrapper>
                <Close onClick={() => setOpen(false)}>X</Close>
                <Title>Upload a New Video</Title>
                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label" style={{ color: "inherit" }}>File Type</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value)}
                    >
                        <FormControlLabel value="upload" control={<Radio />} label="Upload" />
                        <FormControlLabel value="url" control={<Radio />} label="URL" />
                    </RadioGroup>
                </FormControl>
                {fileType === 'upload' && <Label>Video:</Label>}
                {videoPerc > 0 ? (
                    <>
                        <h3 style={{ wordWrap: 'break-word'}}>{video.name}</h3>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress variant="determinate" value={videoPerc} />
                            </Box>
                            <Box sx={{ minWidth: 35 }}>
                                <Typography variant="body2" color="text.secondary" style={{  color: 'inherit' }}>{videoPerc}%</Typography>
                            </Box>
                        </Box>
                    </>
                ) : (
                    fileType === 'upload' ? 
                        (
                            <Button variant="contained" component="label">
                                <VideoCameraBackIcon />&nbsp;Upload Video
                                <input hidden accept="video/*" multiple type="file" onChange={(e) => setVideo(e.target.files[0])} />
                            </Button>
                        )
                        : 
                        (
                            <Input
                                type="text"
                                placeholder="Video URL"
                                name="title"
                                onChange={(e) => setInputs((prev) => {
                                    return { ...prev, videoUrl: e.target.value };
                                })}
                            />
                        )
                    
                )}
                {fileType === 'upload' && <Label>Image:</Label>}
                {imgPerc > 0 ? (
                    <>
                        <h3 style={{ wordWrap: 'break-word'}}>{img.name}</h3>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress variant="determinate" value={imgPerc} />
                            </Box>
                            <Box sx={{ minWidth: 35 }}>
                                <Typography variant="body2" color="text.secondary" style={{  color: 'inherit' }}>{imgPerc}%</Typography>
                            </Box>
                        </Box>
                    </>
                ) : (
                    fileType === 'upload' ? 
                        (
                            <Button variant="contained" component="label">
                                <PhotoCamera />&nbsp;Upload Image
                                <input hidden accept="image/*" multiple type="file" onChange={(e) => setImg(e.target.files[0])} />
                            </Button>
                        )
                        :
                        (
                            <Input
                                type="text"
                                placeholder="Image URL"
                                name="title"
                                onChange={(e) => setInputs((prev) => {
                                    return { ...prev, imgUrl: e.target.value };
                                })}
                            />
                        )
                )}
                <Input
                    type="text"
                    placeholder="Title"
                    name="title"
                    onChange={handleChange}
                />
                <Desc
                    placeholder="Description"
                    name="desc"
                    rows={8}
                    onChange={handleChange}
                />
                <Input
                    type="text"
                    placeholder="Separate the tags with commas."
                    onChange={handleTags}
                />
                {!loading ? 
                    (
                        <UploadButton onClick={handleUpload}>Upload</UploadButton>
                    )
                    :
                    (
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    )
                }
            </Wrapper>
        </Container>
    )
}

export default Upload