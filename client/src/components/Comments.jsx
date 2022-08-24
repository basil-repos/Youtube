import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { axiosInstance } from "../config";
import Comment from "./Comment";
import React from "react";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const Comments = ({videoId}) => {
    
    const { currentUser } = useSelector((state) => state.user);

    const [comments, setComments] = useState([]);
    const [desc, setDesc] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
        try {
            const res = await axiosInstance.get(`/comments/${videoId}`);
            setComments(res.data);
        } catch (err) {}
        };
        fetchComments();
    }, [videoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(desc !== ""){
            const res = await axiosInstance.post("/comments", { desc, videoId });

            if(res.status == 200){
                setComments((prev) => {
                    return [ res.data, ...prev ];
                });
                setDesc("");
                setOpen(true)
                setTimeout(() => {
                    setOpen(false)
                }, 4000)
            }
        }
    }

    return (
        <Container>
            {currentUser && 
            <>
                <NewComment>
                    <Avatar src={currentUser?.img} />
                    <Input placeholder="Add a comment..." value={desc} onChange={(e) => setDesc(e.target.value)} />
                </NewComment>
                <ButtonWrapper>
                    <Button onClick={handleSubmit}>Comment</Button>
                </ButtonWrapper>
            </>
            }
            {comments.map(comment => (
                <Comment comment={comment} key={comment._id} />
            ))}
        </Container>
    )
}

export default Comments