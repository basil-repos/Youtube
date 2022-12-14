import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import videoRoutes from './routes/videos.js';
import commentRoutes from './routes/comments.js';

const app = express();
dotenv.config();

app.use(cors({ origin: true, credentials: true }));

const dbconnect = () => {
    mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log('Connected to Database');
    }).catch(error => {
        throw error;
    });
}

// Cookie
app.use(cookieParser());

// Routes
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

// Error
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";

    return res.status(status).json({
        success: false,
        status,
        message
    })
})

app.listen(process.env.PORT || 8800, () => {
    dbconnect();
    console.log('Connected to Server');
})