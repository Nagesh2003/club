import mongoose from "mongoose";


const meetingSchema = new mongoose.Schema(
    {
        startTime: {
            type: Date,
            required: true
        },
        endTime:
        {
            type: Date,
            required: true
        },
        description:
        {
            type: String,
            required: true
        },
        url:
        {
            type: String,
            required: true
        }
    });


export default mongoose.model('Meeting', meetingSchema)