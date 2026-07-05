/**
 * -----------------------------------------------------------------------------
 * Chapter 03 - Function Calling
 * -----------------------------------------------------------------------------
 *
 * Description:
 * This example demonstrates how to use the OpenAI Chat Completions API with
 * Function Calling (Tool Calling).
 *
 * Large Language Models (LLMs) cannot execute JavaScript functions or access
 * real-time information directly.
 *
 * Instead, they can request that the application execute a registered function.
 *
 * Workflow:
 *
 * 1. User asks a question.
 * 2. The model decides whether a tool is required.
 * 3. If required, the model returns a tool call.
 * 4. The application executes the requested function.
 * 5. The function result is added to the conversation.
 * 6. A second request is sent to OpenAI.
 * 7. The model generates the final answer.
 * -----------------------------------------------------------------------------
 */

import { OpenAI } from 'openai';
import { configDotenv } from 'dotenv';

/**
 * Load environment variables from the `.env` file.
 *
 * Required:
 * OPEN_AI_API_KEY=<your_api_key>
 */
configDotenv();

/**
 * Create an authenticated OpenAI client.
 *
 * Every request made to the OpenAI API goes through this client.
 */
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
});

/**
 * -----------------------------------------------------------------------------
 * Local Tool
 * -----------------------------------------------------------------------------
 *
 * This function returns the current date and time in the Indian Standard Time
 * (IST) timezone.
 *
 * IMPORTANT:
 * The AI model CANNOT execute this function.
 *
 * The model can only REQUEST that this function be executed.
 *
 * Your application is responsible for:
 *
 * 1. Detecting the request.
 * 2. Executing this function.
 * 3. Returning the result back to the model.
 * -----------------------------------------------------------------------------
 */
function getTimeOfIndia(): string {
    return new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
    });
}

/**
 * -----------------------------------------------------------------------------
 * Conversation Context
 * -----------------------------------------------------------------------------
 *
 * The context array stores the complete conversation history.
 *
 * Every API request sends this array to the model.
 *
 * Messages are stored in chronological order.
 *
 * Example:
 *
 * System
 * ↓
 * User
 * ↓
 * Assistant
 * ↓
 * Tool
 * ↓
 * Assistant
 * -----------------------------------------------------------------------------
 */
let context: OpenAI.ChatCompletionMessageParam[] = [
    {
        /**
         * System messages define the assistant's behavior.
         *
         * They are always sent before any user message.
         */
        role: 'system',
        content: 'Pretend to be a helpful assistant.',
    },

    /**
     * Initial user message.
     */
    {
        role: 'user',
        content: 'What is the current time in India?',
    },
];

/**
 * -----------------------------------------------------------------------------
 * Sends the conversation to OpenAI.
 *
 * If the model requests a tool, the tool is executed and a second request
 * is sent containing the tool result.
 * -----------------------------------------------------------------------------
 */
async function callAI() {

    /**
     * -------------------------------------------------------------------------
     * First API Request
     * -------------------------------------------------------------------------
     *
     * Purpose:
     * Allow the model to determine whether it needs a tool.
     *
     * Possible outcomes:
     *
     * 1. Normal text response.
     * 2. Tool request.
     * -------------------------------------------------------------------------
     */
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',

        /**
         * Complete conversation history.
         */
        messages: context,

        /**
         * Register available tools.
         *
         * The model becomes aware of these functions but does NOT execute them.
         */
        tools: [
            {
                type: 'function',

                function: {

                    /**
                     * Unique tool name.
                     *
                     * The model returns this name when requesting execution.
                     */
                    name: 'getTimeOfIndia',

                    /**
                     * Tool description.
                     *
                     * This is extremely important because the model uses this
                     * description to decide when the function should be called.
                     */
                    description:
                        'Returns the current date and time in India (Asia/Kolkata timezone). Use this whenever the user asks for the current time in India.',

                    /**
                     * Input schema.
                     *
                     * This function accepts no parameters.
                     */
                    parameters: {
                        type: 'object',
                        properties: {},
                        required: [],
                        additionalProperties: false,
                    },
                },
            },
        ],

        /**
         * Allow the model to decide whether a tool is required.
         */
        tool_choice: 'auto',
    });

    /**
     * Display the assistant's first response.
     *
     * This may be:
     *
     * - A normal reply.
     * - A tool request.
     */
    console.log(
        `Role: ${response.choices[0]?.message.role} => Reply: ${response.choices[0]?.message.content}`
    );

    /**
     * Store the assistant message.
     *
     * IMPORTANT:
     *
     * If the assistant requested a tool,
     * this message contains the tool call metadata.
     *
     * It MUST be added to the conversation before
     * appending the tool response.
     */
    if (response.choices[0]?.message) {
        context.push(response.choices[0].message);
    }

    /**
     * Determine whether the model requested a tool.
     */
    const needsTool =
        response.choices[0]?.finish_reason === 'tool_calls';

    /**
     * Retrieve the first requested tool.
     */
    const toolCall =
        response.choices[0]?.message.tool_calls?.[0];

    /**
     * Execute the requested function.
     */
    if (needsTool && toolCall) {

        /**
         * Currently we only support function tools.
         */
        if (toolCall.type === 'function') {

            /**
             * Name of the requested function.
             */
            const toolName = toolCall.function.name;

            /**
             * Execute the matching local function.
             */
            if (toolName === 'getTimeOfIndia') {

                /**
                 * Execute JavaScript function.
                 */
                const currentTime = getTimeOfIndia();

                /**
                 * Add the tool result to the conversation.
                 *
                 * The tool_call_id links this response to the
                 * corresponding tool request.
                 */
                context.push({
                    role: 'tool',
                    content: currentTime,
                    tool_call_id: toolCall.id,
                });
            }
        }
    }

    /**
     * -------------------------------------------------------------------------
     * Second API Request
     * -------------------------------------------------------------------------
     *
     * The model now receives:
     *
     * - User message
     * - Assistant tool request
     * - Tool output
     *
     * Using this information, it generates the final response.
     * -------------------------------------------------------------------------
     */
    const finalResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: context,
    });

    /**
     * Display the final AI response.
     */
    console.log(
        `Role: ${finalResponse.choices[0]?.message.role} => Reply: ${finalResponse.choices[0]?.message.content}`
    );
}

/**
 * -----------------------------------------------------------------------------
 * Application Entry Point
 * -----------------------------------------------------------------------------
 *
 * Starts the Function Calling demonstration.
 * -----------------------------------------------------------------------------
 */
async function run() {
    await callAI();
}

/**
 * Launch the application.
 */
run();