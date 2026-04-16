import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const chatWithAI = async (req, res) => {
    try {
        const { message, history, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // Use Rasa Webhook URL from environment variables, or fallback to dev default
        const rasaUrl = process.env.RASA_WEBHOOK_URL || "http://localhost:5005/webhooks/rest/webhook";
        const senderId = sessionId || req.ip || "default_user";

        // Send message to Rasa webhook
        const rasaResponse = await axios.post(rasaUrl, {
            sender: senderId,
            message: message
        });

        // Combine all text responses from Rasa
        let text = "I'm currently attending a show at the moment. Please try again in just a bit!";
        
        if (rasaResponse.data && rasaResponse.data.length > 0) {
            text = rasaResponse.data
                .filter(msg => msg.text)
                .map(msg => msg.text)
                .join("\n\n");
        }

        // Return in the format expected by the frontend
        res.status(200).json({
            reply: text,
            history: [
                ...(history || []),
                { role: "user", parts: [{ text: message }] },
                { role: "model", parts: [{ text: text }] }
            ]
        });
    } catch (error) {
        console.error("AI Chat Error (Rasa):", error);
        res.status(500).json({ message: "Failed to communicate with AI", error: error.message });
    }
};
