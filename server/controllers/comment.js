import Video from "../models/Video.js"
import Comment from "../models/Comment.js"
import { createError } from "../error.js";

export const addComment = async (req, res, next) => {
    const newComment = new Comment({...req.body, userId: req.user.id});
    try {
        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    } catch (error) {
        next(error);
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if(!comment) return next(createError(404, "Comment not found"));

        const video = await Video.findById(comment.videoId);

        if(req.user.id === comment.userId || req.user.id === video.userId) {
            await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json("Comment has been deleted");
        }else{
            return next(createError(403, "you can only delete your own comment"))
        }
    } catch (error) {
        next(error);
    }
}

export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({videoId: req.params.videoId }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}