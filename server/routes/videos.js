import express from 'express';
import { addVideo, deleteVideo, dislike, getByTag, getVideo, like, randomVideos, search, subscribedVideos, trendingVideos, updateVideo } from '../controllers/video.js';
import { verifyToken } from '../verifyToken.js';

const router = express.Router();

// Create a video
router.post('/', verifyToken, addVideo);

// Update a video
router.put('/:id', verifyToken, updateVideo);

// Delete a video
router.delete('/:id', verifyToken, deleteVideo);

// Get a video
router.get('/find/:id', getVideo);

// Increment video views
router.get('/view/:id', getVideo);

// Trending videos
router.get('/trending', trendingVideos);

// Random videos
router.get('/random', randomVideos);

// Subscribed videos
router.get('/subscribed', verifyToken, subscribedVideos);

// Search video by tags
router.get('/tags', getByTag);

// Search video by title
router.get('/search', search);

// Like a video
router.put("/like/:videoId", verifyToken, like);

// Dislikes a video
router.put("/dislike/:videoId", verifyToken, dislike);

export default router;