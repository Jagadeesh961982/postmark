import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
    from: String,
    subject: String,
    body: String,
    aiResponse: String,
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Feedback', FeedbackSchema);
