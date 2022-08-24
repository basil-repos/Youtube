import Video from "../models/Video.js"
import User from "../models/User.js";
import { createError } from "../error.js";

export const addVideo = async (req, res, next) => {
    const newVideo = new Video({ userId: req.user.id, ...req.body });
    try {
        const savedVideo = await newVideo.save(newVideo);

        res.status(200).json(savedVideo);
    } catch (error) {
        next(error);
    }    
}

export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if(!video) return next(createError(404, "Video not found"));

        if(req.user.id === video.userId){
            const updateVideo = await Video.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true });

            res.status(200).json(updateVideo);
        }else{
            return next(createError(403, "you can only update your own video"))
        }
    } catch (error) {
        next(error);
    }
}

export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if(!video) return next(createError(404, "Video not found"));

        if(req.user.id === video.userId){
            await Video.findByIdAndDelete(req.params.id);

            res.status(200).json("Video has been deleted");
        }else{
            return next(createError(403, "you can only delete your own video"))
        }
    } catch (error) {
        next(error);
    }
}

export const getVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        res.status(200).json(video);
    } catch (error) {
        next(error);
    }
}

export const addVideoViews = async (req, res, next) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 }
        });
        res.status(200).json("view has been increased");
    } catch (error) {
        next(error);
    }
}

export const trendingVideos = async (req, res, next) => {
    try {
        const page = req.body.page ? req.body.page : 1;
        const perPage = 9;
        const skip = perPage * page - perPage;
        const videos = await Video.find().sort({ views: -1 }).limit(perPage).skip(skip);
        const total_count = await Video.count();
        const pages = total_count > 0 ? Math.ceil(total_count/perPage) : 0;
        const output = { videos, pages };

        res.status(200).json(output);
    } catch (error) {
        next(error);
    }
}

export const randomVideos = async (req, res, next) => {
    try {
        const page = req.body.page ? req.body.page : 1;
        const perPage = 9;
        const skip = perPage * page - perPage;
        const videos = await Video.find().limit(perPage).skip(skip).sort({ createdAt: -1 });
        const total_count = await Video.count();
        const pages = total_count > 0 ? Math.ceil(total_count/perPage) : 0;
        const output = { videos, pages };

        res.status(200).json(output);
    } catch (error) {
        next(error);
    }
}

export const subscribedVideos = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const subscribedChannels = user.subscribedUsers;

        const list = await Promise.all(
            subscribedChannels.map(channelId => {
                return Video.find({ userId: channelId });
            })
        );
        const videos = list.flat().sort((a,b) => b.createdAt - a.createdAt);
        const output = { videos, pages: 0 };

        res.status(200).json(output);
    } catch (error) {
        next(error);
    }
}

export const getByTag = async (req, res, next) => {
    const tags = req.query.tags.split(",");
    try {
        const videos = await Video.find({ tags: { $in: tags } }).limit(20);
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
}

export const search = async (req, res, next) => {
    const query = req.query.q;
    try {
        const videos = await Video.find({title: { $regex: query, $options: "i" } }).limit(40);
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
}

export const like = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { likes: id },
            $pull: { dislikes: id }
        });
        res.status(200).json("Video has been liked");
    } catch (error) {
        next(error)
    }
}

export const dislike = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: id },
            $pull: { likes: id }
        });
        res.status(200).json("Video has been disliked");
    } catch (error) {
        next(error)
    }
}