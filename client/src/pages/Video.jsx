import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Comments from "../components/Comments";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { dislike, fetchSuccess, like, views } from "../redux/videoSlice";
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";
import Recommendation from "../components/Recommendation";
import { axiosInstance } from "../config";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;

const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const Subscribe = styled.button`
  background-color: ${({type, theme}) => type === "SUBSCRIBED" ? theme.bgLighter : '#cc1a00'};
  font-weight: 500;
  color: ${({type}) => type === "SUBSCRIBED" ? '#cc1a00' : 'white'};
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.iframe`
    height: 520px;
    width: 100%;
    object-fit: cover;
`

const OtherDetails = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
`

const Tags = styled.div`
    margin-top: 10px;
`

const Tag = styled.span`
    color: blue;
    margin-right: 2px;
`


const Video = () => {

    const { currentUser } = useSelector(state => state.user);
    const { currentVideo } = useSelector(state => state.video);
    const dispatch = useDispatch();

    const path = useLocation().pathname.split("/")[2];
    
    const [channel, setChannel] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const videoRes = await axiosInstance.get(`/videos/find/${path}`);
                const channelRes = await axiosInstance.get(`/users/find/${videoRes.data.userId}`);
                
                setChannel(channelRes.data);
                dispatch(fetchSuccess(videoRes.data));
                updateViews();
            } catch (err) {}
        };
        fetchData();
    }, [path, dispatch]);

    const updateViews = async () => {
        await axiosInstance.put(`/videos/view/${currentVideo._id}`);
        dispatch(views());
    }

    const handleLike = async () => {
        await axiosInstance.put(`/videos/like/${currentVideo._id}`);
        dispatch(like(currentUser._id));
    };

    const handleDislike = async () => {
        await axiosInstance.put(`/videos/dislike/${currentVideo._id}`);
        dispatch(dislike(currentUser._id));
    };

    const handleSubscribe = async () => {
        currentUser.subscribedUsers.includes(channel._id) 
          ?  await axiosInstance.put(`/users/unsubscribe/${channel._id}`)
          : await axiosInstance.put(`/users/subscribe/${channel._id}`);

        dispatch(subscription(channel._id));
    }

    return (
        <Container>
            {currentVideo && <Content>
                <VideoWrapper>
                    <VideoFrame src={currentVideo.videoUrl} controls />
                </VideoWrapper>
                <Title>{currentVideo.title}</Title>
                <Details>
                    <Info>{currentVideo.views} views • {format(currentVideo.createdAt)}</Info>
                    <Buttons>
                        <Button onClick={handleLike}>
                            {currentVideo.likes?.includes(currentUser?._id) ? (
                                <ThumbUpIcon />
                            ) : (
                                <ThumbUpOutlinedIcon />
                            )}{" "}
                            {currentVideo.likes?.length}
                        </Button>
                        <Button onClick={handleDislike}>
                            {currentVideo.dislikes?.includes(currentUser?._id) ? (
                                <ThumbDownIcon />
                            ) : (
                                <ThumbDownOffAltOutlinedIcon />
                            )}{" "}
                            Dislike
                        </Button>
                        <Button>
                            <ReplyOutlinedIcon /> Share
                        </Button>
                        <Button>
                            <AddTaskOutlinedIcon /> Save
                        </Button>
                    </Buttons>
                </Details>
                <OtherDetails>
                    <Description>{currentVideo.desc}</Description>
                    <Tags>
                    {currentVideo.tags.map((tag) => (
                        <Tag>#{tag}</Tag>
                    ))}
                    </Tags>
                </OtherDetails>
                <Hr />
                <Channel>   
                    <ChannelInfo>
                        <Image src={channel.img} />
                        <ChannelDetail>
                            <ChannelName>{channel.name}</ChannelName>
                            <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
                        </ChannelDetail>
                    </ChannelInfo>
                    <Subscribe onClick={handleSubscribe} type={currentUser ? currentUser.subscribedUsers?.includes(channel._id) ? "SUBSCRIBED" : "SUBSCRIBE" : "SUBSCRIBE"}>{currentUser ? currentUser.subscribedUsers?.includes(channel._id) ? "SUBSCRIBED" : "SUBSCRIBE" : "SUBSCRIBE"}</Subscribe>
                </Channel>
                <Hr />
                <Comments videoId={currentVideo._id} />
            </Content>}
            <Recommendation tags={currentVideo?.tags} />
        </Container>
    )
}

export default Video