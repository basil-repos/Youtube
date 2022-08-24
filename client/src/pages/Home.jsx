import { useEffect, useState } from "react"
import styled from "styled-components"
import Card from "../components/Card"
import { axiosInstance } from "../config"
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`

const PaginationWrapper = styled.div`
    display: flex;
    justify-content: end;
`

const SkeletonWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 40px;
`

const Home = ({type}) => {
    const [page, setPage] = useState(1);
    const [videos, setVideos] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            const res = await axiosInstance.post(`/videos/${type}`, {page});
            setVideos(res.data.videos);
            setTotalRows(res.data.pages);
            setLoading(false);
        }

        fetchVideos();
    },[type, page]);

    const handlePagination = (e, newPage) => {
        setPage(newPage)
    }

    return (
        <>
        <Container>
            {!loading ? (videos.map(video => (
                <Card video={video} key={video._id} />
            ))) : (
                <SkeletonWrapper>
                    <Skeleton variant="rectangular" width={360} height={218} sx={{ bgcolor: 'grey.900' }} />
                    <Skeleton variant="rectangular" width={360} height={218} sx={{ bgcolor: 'grey.900' }} />
                    <Skeleton variant="rectangular" width={360} height={218} sx={{ bgcolor: 'grey.900' }} />
                    <Skeleton variant="rectangular" width={360} height={218} sx={{ bgcolor: 'grey.900' }} />
                    <Skeleton variant="rectangular" width={360} height={218} sx={{ bgcolor: 'grey.900' }} />
                    <Skeleton variant="rectangular" width={360} height={218} sx={{ bgcolor: 'grey.900' }} />
                </SkeletonWrapper>
            )}
        </Container>
        {totalRows > 0 && !loading && <PaginationWrapper>
            <Pagination 
                count={totalRows} 
                color="primary" 
                page={page}
                onChange={handlePagination}
            />
        </PaginationWrapper>}
        </>
    )
}

export default Home