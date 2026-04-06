import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // System prompt to give context about Moda Week International
        const systemInstruction = `
            You are Moda Bot, the official AI Assistant for Moda Week International. 
            Moda Week International is a premium fashion event showcasing global designers, models, and talent.
            
            Your goal is to help visitors with:
            1. Information about upcoming events and fashion shows.
            2. Details about our production team, designers, and performers.
            3. Ticketing and registration inquiries.
            4. General fashion event questions.
            
            Keep your tone professional, stylish, and helpful. 
            If you don't know a specific detail (like a specific seat number), advise the user to contact our support team at support@modaweekinternational.com.
        `;

        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(systemInstruction + "\n\nUser: " + message);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({
            reply: text,
            history: [
                ...(history || []),
                { role: "user", parts: [{ text: message }] },
                { role: "model", parts: [{ text: text }] }
            ]
        });
    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ message: "Failed to communicate with AI", error: error.message });
    }
};
