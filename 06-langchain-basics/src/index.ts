/**
 * =============================================================================
 * Chapter 06 - LangChain Basics
 * =============================================================================
 *
 * Description
 * -----------------------------------------------------------------------------
 * This chapter introduces LangChain, one of the most popular frameworks for
 * building applications powered by Large Language Models (LLMs).
 *
 * Until now, every request in this course was made directly using the
 * OpenAI SDK.
 *
 * Example:
 *
 * Application
 *      │
 *      ▼
 * OpenAI SDK
 *      │
 *      ▼
 * OpenAI API
 *      │
 *      ▼
 * GPT Model
 *
 * -----------------------------------------------------------------------------
 *
 * With LangChain, an additional abstraction layer is introduced.
 *
 * Application
 *      │
 *      ▼
 * LangChain
 *      │
 *      ▼
 * OpenAI
 *      │
 *      ▼
 * GPT Model
 *
 * -----------------------------------------------------------------------------
 *
 * LangChain provides reusable components for:
 *
 * • Chat Models
 * • Prompt Templates
 * • Streaming
 * • Batch Processing
 * • Chains
 * • Memory
 * • Retrieval (RAG)
 * • Agents
 * • Output Parsers
 *
 * Instead of repeatedly writing low-level API logic,
 * LangChain provides a clean and consistent developer experience.
 *
 * =============================================================================
 */

/**
 * -----------------------------------------------------------------------------
 * Import Environment Configuration
 * -----------------------------------------------------------------------------
 *
 * dotenv loads variables stored inside the `.env` file
 * into Node.js' process.env object.
 *
 * Example:
 *
 * OPEN_AI_API_KEY=sk-xxxxxxxx
 *
 * After loading:
 *
 * process.env.OPEN_AI_API_KEY
 *
 * becomes available throughout the application.
 * -----------------------------------------------------------------------------
 */
import { configDotenv } from "dotenv";

/**
 * -----------------------------------------------------------------------------
 * Import Prompt Template
 * -----------------------------------------------------------------------------
 *
 * ChatPromptTemplate allows us to create reusable prompts.
 *
 * Instead of hardcoding prompts,
 * we define placeholders.
 *
 * Example
 *
 * Template
 *
 * Translate below text to {language}
 *
 * Variables
 *
 * language = Hindi
 *
 * text = Hello
 *
 * Final Prompt
 *
 * Translate below text to Hindi
 *
 * Hello
 *
 * -----------------------------------------------------------------------------
 */
import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * -----------------------------------------------------------------------------
 * Load Environment Variables
 * -----------------------------------------------------------------------------
 *
 * Reads the .env file.
 *
 * Required:
 *
 * OPEN_AI_API_KEY=<your_api_key>
 *
 * Without calling configDotenv(),
 * process.env.OPEN_AI_API_KEY
 * will be undefined.
 * -----------------------------------------------------------------------------
 */
configDotenv();

/**
 * -----------------------------------------------------------------------------
 * Import ChatOpenAI
 * -----------------------------------------------------------------------------
 *
 * ChatOpenAI is LangChain's wrapper around OpenAI's
 * Chat Completion models.
 *
 * Instead of interacting with the OpenAI SDK directly,
 * LangChain exposes a higher-level abstraction.
 *
 * Internally
 *
 * ChatOpenAI
 *      │
 *      ▼
 * OpenAI SDK
 *      │
 *      ▼
 * OpenAI API
 *      │
 *      ▼
 * GPT Model
 *
 * -----------------------------------------------------------------------------
 */
import { ChatOpenAI } from "@langchain/openai";

/**
 * =============================================================================
 * Chat Model
 * =============================================================================
 *
 * A Chat Model represents an AI model capable of
 * processing conversations.
 *
 * Examples:
 *
 * • GPT-4o
 * • GPT-4o-mini
 * • Claude
 * • Gemini
 * • Mistral
 *
 * LangChain provides a consistent interface for all
 * supported chat providers.
 *
 * This means your application code changes very little
 * when switching providers.
 *
 * =============================================================================
 */

/**
 * Create a reusable ChatOpenAI instance.
 *
 * Every interaction with the language model
 * goes through this object.
 *
 * Instead of creating a new model for every request,
 * production applications usually create one instance
 * and reuse it throughout the application lifecycle.
 */
const model = new ChatOpenAI({

    /**
     * Language Model Name.
     *
     * gpt-4o-mini
     *
     * Small, fast and cost-efficient model.
     */
    model: "gpt-4o-mini",

    /**
     * API Key used for authentication.
     *
     * Loaded from the .env file.
     */
    apiKey: process.env.OPEN_AI_API_KEY

});

/**
 * =============================================================================
 * Chat Model Capabilities
 * =============================================================================
 *
 * This single model instance supports several operations.
 *
 * ┌─────────────────────────────────────────────┐
 * │ invoke()                                    │
 * │                                             │
 * │ Send one prompt and receive one response.   │
 * └─────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────┐
 * │ batch()                                     │
 * │                                             │
 * │ Send multiple prompts together.             │
 * └─────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────┐
 * │ stream()                                    │
 * │                                             │
 * │ Receive the response token-by-token.        │
 * └─────────────────────────────────────────────┘
 *
 * Later chapters will introduce:
 *
 * • bindTools()
 * • withStructuredOutput()
 * • Chains
 * • Memory
 * • Agents
 * • LangGraph
 *
 * =============================================================================
 */

/**
 * =============================================================================
 * End of Part 1
 * =============================================================================
 *
 * Next Part
 *
 * • run()
 * • invoke()
 * • batch()
 * • stream()
 *
 * =============================================================================
 */

/**
 * =============================================================================
 * Chat Model Demonstration
 * =============================================================================
 *
 * The run() function demonstrates the three most commonly used methods
 * provided by LangChain's Chat Models.
 *
 * 1. invoke()
 *      → Single request
 *
 * 2. batch()
 *      → Multiple requests
 *
 * 3. stream()
 *      → Token streaming
 *
 * These three methods cover the majority of day-to-day interactions with
 * Large Language Models.
 *
 * =============================================================================
 */

/**
 * Demonstrates different ways to communicate with an LLM.
 *
 * Workflow
 *
 * Start
 *   │
 *   ▼
 * invoke()
 *   │
 *   ▼
 * batch()
 *   │
 *   ▼
 * stream()
 *   │
 *   ▼
 * End
 */
async function run(): Promise<void> {

    console.log("=====================================");
    console.log("LangChain Chat Model Examples");
    console.log("=====================================\n");

    /**
     * =========================================================================
     * invoke()
     * =========================================================================
     *
     * invoke() is the simplest way to communicate with the model.
     *
     * Input
     *
     * One Prompt
     *
     * ↓
     *
     * Chat Model
     *
     * ↓
     *
     * One Response
     *
     * =========================================================================
     */

    console.log("Example 1 : invoke()\n");

    /**
     * Send a single prompt to the language model.
     */
    const response = await model.invoke(
        "What is the capital of India?"
    );

    /**
     * LangChain returns an AIMessage object,
     * not just plain text.
     *
     * Example
     *
     * AIMessage
     *
     * ├── content
     * ├── response_metadata
     * ├── usage_metadata
     * └── id
     */
    console.log(response);

    console.log("\n");

    /**
     * =========================================================================
     * batch()
     * =========================================================================
     *
     * batch() executes multiple prompts using
     * a single method call.
     *
     * Instead of:
     *
     * invoke()
     * invoke()
     * invoke()
     *
     * We can simply use:
     *
     * batch()
     *
     * =========================================================================
     */

    console.log("Example 2 : batch()\n");

    /**
     * Multiple prompts.
     */
    const batchResponses = await model.batch([

        /**
         * Prompt 1
         */
        "Hello",

        /**
         * Prompt 2
         */
        "What is the height of Mount Everest?"

    ]);

    /**
     * Returns an array of AIMessage objects.
     *
     * Example
     *
     * [
     *   AIMessage,
     *   AIMessage
     * ]
     */
    console.log(batchResponses);

    console.log("\n");

    /**
     * =========================================================================
     * stream()
     * =========================================================================
     *
     * Normally,
     * the model waits until the complete response
     * has been generated.
     *
     * Streaming returns the response incrementally.
     *
     * Example
     *
     * Instead of
     *
     * Hello, my name is ChatGPT.
     *
     * We receive
     *
     * Hello
     *
     * ↓
     *
     * my
     *
     * ↓
     *
     * name
     *
     * ↓
     *
     * is
     *
     * ↓
     *
     * ChatGPT
     *
     * =========================================================================
     */

    console.log("Example 3 : stream()\n");

    /**
     * Request a streaming response.
     *
     * The returned object is an AsyncIterable.
     */
    const streamResponse = await model.stream(
        "What is the Capital Of India?"
    );

    /**
     * Read every streamed chunk.
     *
     * Every iteration contains
     * a small portion of the response.
     */
    for await (const chunk of streamResponse) {

        /**
         * Display streamed content.
         */
        console.log(chunk.content);

    }

    console.log("\n");

    /**
     * =========================================================================
     * Summary
     * =========================================================================
     *
     * invoke()
     *
     * • One Prompt
     * • One Response
     *
     * batch()
     *
     * • Multiple Prompts
     * • Multiple Responses
     *
     * stream()
     *
     * • One Prompt
     * • Streaming Response
     *
     * =========================================================================
     */

    console.log("run() completed.\n");

}

/**
 * =============================================================================
 * End of Part 2
 * =============================================================================
 *
 * Next Part
 *
 * • ChatPromptTemplate
 * • prompt.invoke()
 * • Prompt Variables
 * • toChatMessages()
 * • Program Entry Point
 *
 * =============================================================================
 */

/**
 * =============================================================================
 * Prompt Templates
 * =============================================================================
 *
 * One of LangChain's biggest advantages is Prompt Templates.
 *
 * Instead of hardcoding prompts like this:
 *
 * -----------------------------------------
 *
 * Translate below text to Hindi
 *
 * Hello
 *
 * -----------------------------------------
 *
 * We define a reusable template once
 * and inject variables whenever needed.
 *
 * Example
 *
 * Template
 *
 * Translate below text to {language}
 *
 * User
 *
 * {text}
 *
 * Variables
 *
 * language = Hindi
 *
 * text = Hello
 *
 * Generated Prompt
 *
 * Translate below text to Hindi
 *
 * Hello
 *
 * =============================================================================
 */

/**
 * Demonstrates how Prompt Templates work.
 *
 * Workflow
 *
 * Create Template
 *        │
 *        ▼
 * Inject Variables
 *        │
 *        ▼
 * Generate Messages
 *        │
 *        ▼
 * Send To Model
 *        │
 *        ▼
 * Receive Response
 */
const promptTest = async (): Promise<void> => {

    console.log("=====================================");
    console.log("Prompt Template Example");
    console.log("=====================================\n");

    /**
     * -------------------------------------------------------------------------
     * Step 1
     *
     * Define the System Prompt.
     * -------------------------------------------------------------------------
     *
     * This prompt contains a placeholder.
     *
     * {language}
     *
     * which will be replaced later.
     */
    const systemTemplate =
        "Translate below text to {language}";

    /**
     * -------------------------------------------------------------------------
     * Step 2
     *
     * Create a ChatPromptTemplate.
     * -------------------------------------------------------------------------
     *
     * A ChatPromptTemplate consists of
     * one or more chat messages.
     *
     * Here we create:
     *
     * System Message
     *
     * +
     *
     * User Message
     */
    const prompt = ChatPromptTemplate.fromMessages([

        /**
         * System Message
         *
         * Defines the behaviour.
         */
        [
            "system",
            systemTemplate
        ],

        /**
         * User Message
         *
         * Contains another placeholder.
         */
        [
            "user",
            "{text}"
        ]

    ]);

    /**
     * -------------------------------------------------------------------------
     * Step 3
     *
     * Fill Template Variables.
     * -------------------------------------------------------------------------
     *
     * invoke() on a PromptTemplate DOES NOT
     * call the LLM.
     *
     * It only replaces placeholders.
     *
     * Example
     *
     * language = Hindi
     *
     * text = hi
     *
     * Result
     *
     * System
     *
     * Translate below text to Hindi
     *
     * User
     *
     * hi
     */
    const promptValue = await prompt.invoke({

        /**
         * Replace {language}
         */
        language: "Hindi",

        /**
         * Replace {text}
         */
        text: "hi"

    });

    /**
     * -------------------------------------------------------------------------
     * Step 4
     *
     * Convert PromptValue into Chat Messages.
     * -------------------------------------------------------------------------
     *
     * Chat Models expect
     * an array of chat messages.
     *
     * toChatMessages() converts
     * the generated prompt into
     * that format.
     *
     * Output
     *
     * [
     *   SystemMessage,
     *   HumanMessage
     * ]
     */
    const messages =
        promptValue.toChatMessages();

    /**
     * -------------------------------------------------------------------------
     * Step 5
     *
     * Send Messages to the Model.
     * -------------------------------------------------------------------------
     *
     * Unlike invoke("text"),
     * we now pass structured chat messages.
     */
    const result =
        await model.invoke(messages);

    /**
     * Display the response.
     */
    console.log(result);

    console.log("\nPrompt Template completed.\n");

};

/**
 * =============================================================================
 * Program Entry Point
 * =============================================================================
 *
 * Every Node.js application starts here.
 *
 * In this chapter we execute:
 *
 * 1. Chat Model Examples
 * 2. Prompt Template Example
 *
 * =============================================================================
 */

/**
 * Main application.
 *
 * Using an async wrapper ensures
 * both examples run sequentially
 * instead of simultaneously.
 */
async function main(): Promise<void> {

    console.log("=====================================");
    console.log("Chapter 06 - LangChain Basics");
    console.log("=====================================\n");

    /**
     * Demonstrate:
     *
     * invoke()
     * batch()
     * stream()
     */
    await run();

    /**
     * Demonstrate:
     *
     * ChatPromptTemplate
     */
    await promptTest();

    console.log("=====================================");
    console.log("Chapter Completed Successfully");
    console.log("=====================================");
}

/**
 * Start the application.
 */
main();

/**
 * =============================================================================
 * End of Chapter 06
 * =============================================================================
 *
 * What You Learned
 *
 * ✓ ChatOpenAI
 *
 * ✓ invoke()
 *
 * ✓ batch()
 *
 * ✓ stream()
 *
 * ✓ ChatPromptTemplate
 *
 * ✓ Prompt Variables
 *
 * ✓ PromptValue
 *
 * ✓ toChatMessages()
 *
 * =============================================================================
 *
 * Production Notes
 *
 * • Reuse ChatOpenAI instances.
 *
 * • Store prompts in separate files.
 *
 * • Validate prompt variables.
 *
 * • Add try/catch around model calls.
 *
 * • Log token usage.
 *
 * • Use streaming for long responses.
 *
 * • Reuse Prompt Templates across modules.
 *
 * =============================================================================
 *
 * Next Chapter
 *
 * Chapter 07
 *
 * Retrieval-Augmented Generation (RAG)
 *
 * LangChain
 *        │
 *        ▼
 * Retriever
 *        │
 *        ▼
 * ChromaDB
 *        │
 *        ▼
 * Retrieved Documents
 *        │
 *        ▼
 * Prompt Template
 *        │
 *        ▼
 * ChatOpenAI
 *        │
 *        ▼
 * Final Answer
 *
 * =============================================================================
 */