/**
 * -----------------------------------------------------------------------------
 * Chapter 01 - Basic OpenAI Model
 * -----------------------------------------------------------------------------
 *
 * This example demonstrates the simplest way to communicate with an OpenAI
 * language model using the official OpenAI Node.js SDK.
 *
 * Workflow:
 * 1. Load environment variables.
 * 2. Create an OpenAI client.
 * 3. Send a prompt to the model.
 * 4. Receive the AI response.
 * 5. Print the response to the console.
 * -----------------------------------------------------------------------------
 */

import { OpenAI } from 'openai';
import { configDotenv } from 'dotenv';

/**
 * Loads variables from the .env file into process.env.
 *
 * Example:
 * OPEN_AI_API_KEY=your_api_key
 */
configDotenv();

/**
 * Creates an OpenAI client instance.
 *
 * The client is responsible for making authenticated API
 * requests to OpenAI services.
 */
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
});

/**
 * Sends a user message to the language model and prints
 * the generated response.
 */
async function run() {
    /**
     * Create a chat completion.
     *
     * Model:
     * gpt-4o-mini
     *
     * Messages:
     * The conversation history that the model uses
     * to generate its response.
     */
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'user',
                content: 'Hello My name is Bhomik',
            },
        ],
    });

    /**
     * Display the generated response.
     */
    console.log(response.choices[0]?.message.content);
}

/**
 * Application Entry Point
 */
run();