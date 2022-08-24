import express from 'express';
import { addVideo, addVideoViews, deleteVideo, dislike, getByTag, getVideo, like, randomVideos, search, subscribedVideos, trendingVideos, updateVideo } from '../controllers/video.js';
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
router.put('/view/:id', addVideoViews);

// Trending videos
router.post('/trending', trendingVideos);

// Random videos
router.post('/random', randomVideos);

// Subscribed videos
router.post('/subscribed', verifyToken, subscribedVideos);

// Search video by tags
router.get('/tags', getByTag);

// Search video by title
router.get('/search', search);

// Like a video
router.put("/like/:videoId", verifyToken, like);

// Dislikes a video
router.put("/dislike/:videoId", verifyToken, dislike);

export default router;