import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import pdfDetails from './models/pdfDetails.js';
import Meeting from './models/zoomlink.js';

// Setup environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;
const mongodbURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongodbURI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3001', 
    optionsSuccessStatus: 200,
}));

// Serve static files from the 'files' directory
app.use("/files", express.static("files"));

const __dirname = path.resolve();
const uploadPath = path.join(__dirname, 'files');

// Ensure upload directory exists
import fs from 'fs';
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname;
        cb(null, uniqueSuffix);
    }
});

// Multer instance for file uploads
const upload = multer({ storage: storage });

// Endpoint to upload a PDF file
app.post("/upload-files", upload.single("file"), async (req, res) => {
    const { title, description, date } = req.body;
    const filename = req.file.filename;

    try {
        console.log("File uploaded:", req.file);
        await pdfDetails.create({
            title: title,
            description: description,
            date: date,
            pdf: filename,
        });
        res.status(200).send("File uploaded successfully");
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Endpoint to update a PDF file
app.put("/update-file/:id", upload.single("file"), async (req, res) => {
    const { title, description, date } = req.body;
    const filename = req.file ? req.file.filename : null;

    try {
        console.log("File updated:", req.file);

        // Update the file details in MongoDB
        const updatedFile = await pdfDetails.findByIdAndUpdate(req.params.id, {
            title: title,
            description: description,
            date: date,
            ...(filename && { pdf: filename }), // Update only if file is changed
        }, { new: true });

        res.status(200).send("File updated successfully");
    } catch (error) {
        console.error("Error updating file:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete("/delete-file/:id", async (req, res) => {
    try {
        const deletedFile = await pdfDetails.findByIdAndDelete(req.params.id);
        if (!deletedFile) {
            return res.status(404).json({ error: 'File not found' });
        }
        console.log("Deleted file:", deletedFile);
        res.status(200).send("File deleted successfully");
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Endpoint to fetch all PDF files
app.get("/get-files", async (req, res) => {
    try {
        const data = await pdfDetails.find({});
        console.log("Fetched files from DB:", data);
        res.send({ status: "ok", data: data });
    } catch (err) {
        console.error("Error fetching files:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Endpoint to schedule a meeting
app.post('/schedule-meeting', async (req, res) => {
    try {
        const { startTime, endTime, description, url } = req.body;
        const newMeeting = new Meeting({
            startTime,
            endTime,
            description,
            url
        });

        await newMeeting.save();
        res.status(201).json({ success: true, data: newMeeting });
    } catch (error) {
        console.error('Error scheduling meeting:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// Endpoint to fetch all meetings
app.get('/get-meetings', async (req, res) => {
    try {
        const meetings = await Meeting.find();
        res.status(200).json({ success: true, data: meetings });
    } catch (error) {
        console.error('Error fetching meetings:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// Endpoint to delete a meeting
app.delete('/delete-meeting/:id', async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting) {
            return res.status(404).json({ success: false, error: 'Meeting not found' });
        }

        await meeting.remove();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error('Error deleting meeting:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
