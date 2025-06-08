import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import webhookRoutes from './routes/webhook.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/webhook', webhookRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
