import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:false,
    },
    headline: {
        type: String,
    },
    content: {
        type: String,
    },
    date: {
        type: String,
    },
    time: {
        type: String,
    },
    fileUrl: {
        type: String,
    }
})

const Reports = mongoose.models.reports || mongoose.model("reports", reportSchema);
export default Reports