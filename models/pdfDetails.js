import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    pdf: { type: String, required: true }
});

export default mongoose.model('pdfDetails', pdfSchema);
