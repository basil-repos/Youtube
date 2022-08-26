import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    videoId: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
}, {timestamps: true}
);

export default mongoose.model('History', HistorySchema);