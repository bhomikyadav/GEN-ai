/**
 * -----------------------------------------------------------------------------
 * Chapter 02 - Chat Conversation Memory
 * -----------------------------------------------------------------------------
 *
 * Description:
 * This example demonstrates how to build a simple conversational AI chatbot
 * using the OpenAI Chat Completions API.
 *
 * Unlike the previous chapter where each request was independent, this example
 * stores the conversation history (context) and sends it with every API request.
 *
 * By maintaining the conversation context, the AI can remember previous
 * messages and generate more natural, context-aware responses.
 *
 * Workflow:
 * 1. Load environment variables.
 * 2. Create an OpenAI client.
 * 3. Initialize the conversation with a System prompt.
 * 4. Read user input from the terminal.
 * 5. Store the user's message in the conversation history.
 * 6. Send the complete conversation to OpenAI.
 * 7. Display the AI response.
 * 8. Store the assistant's response.
 * 9. Repeat until the user exits.
 * -----------------------------------------------------------------------------
 */

import { OpenAI } from 'openai';
import { configDotenv } from 'dotenv';

/**
 * Loads environment variables from the `.env` file into `process.env`.
 *
 * Required:
 * OPEN_AI_API_KEY=<your_openai_api_key>
 */
configDotenv();

/**
 * Creates an authenticated OpenAI client.
 *
 * This client is responsible for communicating with the OpenAI API.
 */
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
});

/**
 * Represents the complete conversation history.
 *
 * Every message sent to the model must contain:
 *
 * - role    -> Who sent the message.
 * - content -> Actual text.
 *
 * Valid roles:
 * - system
 * - user
 * - assistant
 */
type ContextType = {
    role: 'user' | 'assistant' | 'system';
    content: string;
}[];

/**
 * -----------------------------------------------------------------------------
 * Conversation Context
 * -----------------------------------------------------------------------------
 *
 * The context array acts as the chatbot's short-term memory.
 *
 * Every new user message and every AI response is stored here.
 *
 * IMPORTANT:
 * Large Language Models (LLMs) are stateless.
 * They do NOT remember previous API requests.
 *
 * To maintain a conversation, we must send the entire conversation history
 * with every request.
 * -----------------------------------------------------------------------------
 */
let context: ContextType = [
    {
        role: 'system',

        /**
         * The system message defines the assistant's behavior.
         *
         * Examples:
         * - "You are a helpful assistant."
         * - "You are a Node.js expert."
         * - "Always answer in JSON."
         *
         * This message is always sent before any user message.
         */
        content: 'pretend to be as help assistant',
    },
];

/**
 * -----------------------------------------------------------------------------
 * Sends the current conversation to OpenAI and retrieves the next AI response.
 *
 * Flow:
 *
 * Context
 *     │
 *     ▼
 * OpenAI API
 *     │
 *     ▼
 * GPT Model
 *     │
 *     ▼
 * Assistant Response
 * -----------------------------------------------------------------------------
 */
async function callAI() {

    /**
     * Sends the complete conversation history to the model.
     *
     * The model uses every previous message to understand the
     * current conversation.
     */
    const res = await openai.chat.completions.create({

        /**
         * Model used to generate the response.
         */
        model: 'gpt-4o-mini',

        /**
         * Complete conversation history.
         *
         * Example:
         *
         * [
         *   System,
         *   User,
         *   Assistant,
         *   User
         * ]
         */
        messages: context,
    });

    /**
     * Displays the generated response in the terminal.
     */
    console.log(
        `Role: ${res.choices[0]?.message.role} => Reply: ${res.choices[0]?.message.content}`
    );

    /**
     * Stores the assistant's response.
     *
     * This is extremely important.
     *
     * Without saving the AI response, future requests would contain
     * only user messages, causing the assistant to lose its side
     * of the conversation.
     */
    context.push({
        role: 'assistant',
        content: res.choices[0]?.message.content as string,
    });
}

/**
 * -----------------------------------------------------------------------------
 * Starts the chatbot.
 *
 * Responsibilities:
 * - Read user input.
 * - Store user messages.
 * - Call the AI.
 * - Continue until the user exits.
 * -----------------------------------------------------------------------------
 */
async function run() {

    /**
     * Creates a synchronous terminal input.
     *
     * This allows the application to wait for the user's input
     * before continuing execution.
     */
    const input = require('prompt-sync')({
        sigint: true,
    });

    /**
     * Infinite conversation loop.
     *
     * The chatbot continues running until the user types "exit".
     */
    while (true) {

        /**
         * Reads the user's message from the terminal.
         */
        const msg = input('Enter Message: ') as string;

        /**
         * Exit the application.
         */
        if (msg === 'exit') {
            console.log('Exiting...');
            break;
        }

        /**
         * Store the user's message.
         *
         * Every user message is appended to the conversation
         * before sending it to the model.
         */
        context.push({
            role: 'user',
            content: msg,
        });

        /**
         * Send the updated conversation to OpenAI.
         */
        await callAI();
    }
}

/**
 * -----------------------------------------------------------------------------
 * Application Entry Point
 * -----------------------------------------------------------------------------
 *
 * Starts the interactive chatbot.
 */
run();