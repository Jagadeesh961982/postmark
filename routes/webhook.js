import express from 'express';
import Feedback from '../models/feedback.js';
import { classifyEmailAndRespond } from '../services/aiService.js';
import { sendReply } from '../services/postmarkService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { From, Subject, TextBody } = req.body;
        console.log('Received webhook:', { From, Subject, TextBody });

        const aiResponse = await classifyEmailAndRespond(TextBody,From);
        console.log('Classification result:', aiResponse);
        const feedback = await Feedback.create({
            from: From,
            subject: Subject,
            body: TextBody,
    
            aiResponse: aiResponse
        });

        await sendReply(Subject, From, aiResponse);
        res.status(200).json({ message: 'Feedback received' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

export default router;
