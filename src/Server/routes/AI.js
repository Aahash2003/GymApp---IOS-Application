const express = require("express");
const OpenAI = require("openai");
const dotenv = require('dotenv');
const router = express.Router();
dotenv.config();

// In-memory cache object to store responses
const cache = {};

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.KEY, // API key from environment variable
});

router.post('/generate', async (req, res) => {
    try {
        const userPrompt = req.body.prompt;

        // Check if the prompt is longer than 100 characters
        if (userPrompt.length > 100) {
            return res.status(400).json({ error: "Prompt exceeds 100 characters limit." });
        }

        // Check if the response is already in the cache
        if (cache[userPrompt]) {
            console.log("Response served from cache");
            return res.json({ message: cache[userPrompt] });
        }

        // If not cached, call OpenAI API
        const chatCompletion = await openai.chat.completions.create({
            "model": "gpt-3.5-turbo",
            "messages": [
                { "role": "system", "content": "You are a fitness assistant providing fitness-related advice only." },
                { "role": "user", "content": userPrompt }
            ]
        });

        const responseMessage = chatCompletion.choices[0].message;

        // Cache the response
        cache[userPrompt] = responseMessage;

        // Return the response
        res.json({ message: responseMessage });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
