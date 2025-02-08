import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:false,
    },
    videoHeadline: {
        type: String,
    },
    videoContent: {
        type: String,
    },
    category: {
        type: String,
    },
    date: {
        type: String,
    },
    time: {
        type: String,
    },
    videoUrl: {
        type: String,
    }
})

const Videos = mongoose.models.videos || mongoose.model("videos", videoSchema);
export default Videos