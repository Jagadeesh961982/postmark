import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Feedback from '../models/feedback.js'
import { isRelatedToPrevious } from './isContextRelated.js'; 

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
// console.log("✅ Gemini model initialized");
export async function classifyEmailAndRespond(emailText,userEmail) {

    let conversationContext = "";
    const latest = await Feedback.findOne({ from: userEmail }).sort({ timestamp: -1 });

    if (latest) {
        // OPTIONAL: Add your own similarity check here
        const isRelated = isRelatedToPrevious(emailText, latest.body); // 👈 we define this below

        if (isRelated) {
            conversationContext = `
        Previous conversation:
        User: "${latest.body}"
        OnlineStore Support: "${latest.aiResponse}"
        `;
            }
    }


   const prompt = `
        ${conversationContext}

        You are a professional customer support representative at **OnlineStore**, an e-commerce platform.

        A customer has sent the following message:

        "${emailText}"

        As the support representative, your task is to respond **formally and helpfully** to this message. Use the prior conversation above if it is relevant.

        Please ensure your response includes:

        1. A relevant subject line (e.g., "Re: Payment Issue" or "Re: Order Delay")
        2. A professional and empathetic opening sentence
        3.  A structured request for any additional details you need, such as:
        - The exact error message (if applicable)
        - The product name or order ID
        - The date and time the issue occurred
        - The type of card used (Visa, etc.)

        Do not ask for credit/debit card numbers — even partially (e.g., last 4 digits). 
        Just ask for card type only or tell the user to contact support via call for the below given number.
        4. A fallback sentence like:
        > "If you need immediate support, you may contact our customer care team at 123456789."
        5. A polite closing thanking the customer for choosing OnlineStore
        6. Sign off with:
        > Sincerely,  
        > OnlineStore Support Team

        If the customer's message is clearly unrelated to the previous one, treat it as a **new inquiry** and do not reference the old thread.

        Your tone should be:
        - Human-like and empathetic
        - Formal and respectful
        - Avoid casual phrases like “that’s frustrating” or emojis
        ****Note****:if you felt the response is out of scope to you then tell the user to contact support via call. 
      
        `;


    const aiResponse = await callGemini(prompt);
    
 // simplified

    // console.log("✅ Classification result:", {aiResponse });

    return aiResponse;
}

async function callGemini(prompt) {
    try {
    const result = await model.generateContent(prompt);
    const response =result.response;
    return response.text();
    } catch (err) {
        // console.error("❌ Gemini API Error:", err);
        return "general"; // fallback
    }
}
