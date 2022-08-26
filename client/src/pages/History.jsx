import { useEffect, useState } from "react";
import styled from "styled-components"
import HistoryCard from "../components/HistoryCard";
import { axiosInstance } from "../config";
import moment from "moment";

const Container = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
`

const DateWrapper = styled.div`
    display: flex;
    flex-direction: column;
`

const DateTitle = styled.h2`
    color: ${({ theme }) => theme.textSoft};
`

const History = () => {
    const [list, setList] = useState([]);
    const todayDate = new Date();
    const today = todayDate.getFullYear()+"-"+("0" + (todayDate.getMonth() + 1)).slice(-2)+"-"+("0" + todayDate.getDate()).slice(-2);
    
    useEffect(() => {
        const fetchHistory = async () => {
            const res = await axiosInstance.get('/users/history');
            const userVideos = [];
            res.data.map( (video) => { 
                if (!userVideos[video.date]) { 
                    userVideos[video.date] = [];
                    userVideos.push(userVideos[video.date]);
                }
                userVideos[video.date].push(video);
            });
            setList(userVideos);
        }
        fetchHistory();
    },[]);

    return (
        <Container>
            {list.map((item,i) => (
                <DateWrapper key={i}>
                    <DateTitle key={i}>{item[0].date == today ? 'Today' : moment(item[0].date).format("MMM D")}</DateTitle>
                    {item.map((videoList) => (
                        <HistoryCard videoId={videoList.videoId} key={videoList._id} />
                    ))}
                </DateWrapper>
            ))}
        </Container>
    )
}

export default History