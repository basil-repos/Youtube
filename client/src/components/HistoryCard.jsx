import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import styled from "styled-components"
import { axiosInstance } from "../config";

const Container = styled.div`
    margin-bottom: 20px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    margin-bottom: 20px;
`

const Wrapper = styled.div`
    display: flex;
    gap: 20px;
`

const Image = styled.img`
    width: 150px;
    height: 150px;
    background-color: #999;
    flex: 1;
`;


const Details = styled.div`
    display: flex;
    gap: 12px;
    flex: 3;
`;

const Texts = styled.div`
    flex: 1;
`

const Title = styled.h1`
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.text};
`

const ChannelName = styled.h5`
    font-size: 14px;
    color: ${({ theme }) => theme.textSoft};
    margin: 9px 0px;
    flex: 1;
`

const Description = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme.text};
    margin-top: 20px;
`;

function HistoryCard({videoId}) {
    const [video, setVideo] = useState({});
    const [channel, setChannel] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const videoRes = await axiosInstance.get(`/videos/find/${videoId}`);
                const channelRes = await axiosInstance.get(`/users/find/${videoRes.data.userId}`);
                
                setVideo(videoRes.data);
                setChannel(channelRes.data);
            } catch (err) {}
        };
        fetchData();
    }, [videoId]);

    return (
        <Link to={`/video/${videoId}`} style={{ textDecoration: 'none' }}>
            <Container>
                <Wrapper>
                    <Image src={video.imgUrl} />
                    <Details>
                        <Texts>
                            <Title>{video.title}</Title>
                            <ChannelName>{channel.name} &nbsp;&nbsp; {video.views} views</ChannelName>
                            <Description>{video.desc}</Description>
                        </Texts>
                    </Details>
                </Wrapper>
            </Container>
        </Link>
    )
}

export default HistoryCard