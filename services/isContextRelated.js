
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function isRelatedToPrevious(newText, previousText) {

  const similarityPrompt = `
You are an AI assistant that checks whether two user messages are contextually related.

Here is the previous message:
"${previousText}"

Here is the new message:
"${newText}"

Are these two messages related to the same topic or issue?
Reply only with "Yes" or "No". Avoid explanations.
`;

  try {
    const result = await model.generateContent(similarityPrompt);
    const response = await result.response;
    const answer = response.text().trim().toLowerCase();

    return answer === "yes";
  } catch (err) {
    console.error("Similarity check failed:", err.message);
    return false; // fallback to safe default
  }
}
