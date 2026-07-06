/**
 * =============================================================================
 * Chapter 07 - Retrieval-Augmented Generation (RAG)
 * =============================================================================
 *
 * Description
 * -----------------------------------------------------------------------------
 * This chapter combines everything learned so far:
 *
 * ✔ Embeddings
 * ✔ Vector Stores
 * ✔ LangChain
 * ✔ Prompt Engineering
 * ✔ Chat Models
 *
 * to build the first Retrieval-Augmented Generation (RAG) application.
 *
 * -----------------------------------------------------------------------------
 * Traditional LLM
 * -----------------------------------------------------------------------------
 *
 * Question
 *      │
 *      ▼
 * Language Model
 *      │
 *      ▼
 * Answer
 *
 * The model answers only from its pretrained knowledge.
 *
 * -----------------------------------------------------------------------------
 * RAG
 * -----------------------------------------------------------------------------
 *
 * Question
 *      │
 *      ▼
 * Retriever
 *      │
 *      ▼
 * Relevant Documents
 *      │
 *      ▼
 * Prompt
 *      │
 *      ▼
 * Language Model
 *      │
 *      ▼
 * Better Answer
 *
 * -----------------------------------------------------------------------------
 * Instead of relying only on pretrained knowledge,
 * we provide external knowledge retrieved from our documents.
 *
 * =============================================================================
 */

import { configDotenv } from "dotenv";

/**
 * File System
 *
 * Used to read our local knowledge base.
 */
import { readFileSync } from "fs";

/**
 * Creates OS-independent file paths.
 */
import { join } from "path";

/**
 * LangChain Text Splitter.
 *
 * Large documents are divided into smaller chunks
 * before embeddings are created.
 */
import { RecursiveCharacterTextSplitter }
    from "@langchain/textsplitters";

/**
 * LangChain Document object.
 *
 * Every document stored in the Vector Store
 * is represented using this class.
 */
import { Document } from "langchain";

/**
 * In-Memory Vector Store.
 *
 * Stores embeddings inside RAM.
 *
 * This is suitable only for learning
 * and small applications.
 */
import {
    MemoryVectorStore
} from "@langchain/classic/vectorstores/memory";

/**
 * OpenAI Embeddings
 *
 * Converts text into vectors.
 *
 * ChatOpenAI
 *
 * Used later for answer generation.
 */
import {
    OpenAIEmbeddings,
    ChatOpenAI
} from "@langchain/openai";

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
 * =============================================================================
 * Main Application
 * =============================================================================
 *
 * The entire RAG workflow begins here.
 *
 * Workflow
 *
 * Read JSON
 *      │
 *      ▼
 * Create Documents
 *      │
 *      ▼
 * Split Documents
 *      │
 *      ▼
 * Create Embeddings
 *      │
 *      ▼
 * Store Vectors
 *      │
 *      ▼
 * Retrieve Similar Documents
 *      │
 *      ▼
 * Build Prompt
 *      │
 *      ▼
 * Generate Answer
 *
 * =============================================================================
 */
const main = async (): Promise<void> => {

    console.log("=======================================");
    console.log("Chapter 07 - Basic RAG");
    console.log("=======================================\n");

    /**
     * =========================================================================
     * Step 1
     * =========================================================================
     *
     * Read the Knowledge Base.
     *
     * Our application uses a JSON file
     * as its source of information.
     *
     * Example
     *
     * sample.json
     *
     * [
     *   {
     *      id,
     *      title,
     *      content
     *   }
     * ]
     *
     * =========================================================================
     */

    /**
     * Construct an absolute path.
     */
    const filePath = join(
        __dirname,
        "data/sample.json"
    );

    /**
     * Read the JSON file.
     *
     * readFileSync()
     * returns plain text.
     */
    const rawJson = readFileSync(
        filePath,
        "utf8"
    );

    /**
     * Convert JSON string
     * into JavaScript objects.
     */
    const rawData = JSON.parse(rawJson);

    console.log("Knowledge Base Loaded.\n");

    /**
     * =========================================================================
     * Step 2
     * =========================================================================
     *
     * Create a Text Splitter.
     *
     * Why?
     *
     * Large documents are difficult
     * to retrieve efficiently.
     *
     * Instead,
     * we divide them into
     * smaller overlapping chunks.
     *
     * Example
     *
     * Large Document
     *
     * ↓
     *
     * Chunk 1
     *
     * ↓
     *
     * Chunk 2
     *
     * ↓
     *
     * Chunk 3
     *
     * =========================================================================
     */

    /**
     * RecursiveCharacterTextSplitter
     *
     * Splits text while attempting
     * to preserve sentence boundaries.
     */
    const splitter =
        new RecursiveCharacterTextSplitter({

            /**
             * Maximum size of one chunk.
             */
            chunkSize: 100,

            /**
             * Number of characters
             * shared between
             * neighboring chunks.
             *
             * Helps preserve context.
             */
            chunkOverlap: 20

        });

    /**
     * =========================================================================
     * Step 3
     * =========================================================================
     *
     * Convert JSON into LangChain Documents.
     *
     * LangChain works with Document objects,
     * not raw strings.
     *
     * Every document contains:
     *
     * pageContent
     *
     * +
     *
     * metadata
     *
     * =========================================================================
     */

    const docs = rawData.map((item: any) => {

        /**
         * Create one Document.
         */
        return new Document({

            /**
             * Actual searchable content.
             */
            pageContent: item.content,

            /**
             * Additional information.
             *
             * Metadata is useful for:
             *
             * • Source tracking
             * • Filtering
             * • Citations
             */
            metadata: {

                /**
                 * Document ID.
                 */
                id: item.id,

                /**
                 * Document title.
                 */
                title: item.title

            }

        });

    });

    console.log(
        `${docs.length} documents created.\n`
    );

    /**
     * IMPORTANT
     * -------------------------------------------------------------------------
     *
     * In the current implementation,
     * the splitter is created
     * but never used.
     *
     * Instead of passing docs directly
     * to the Vector Store,
     * they should first be split.
     *
     * Example
     *
     * const splitDocs =
     *      await splitter.splitDocuments(docs);
     *
     * Then use:
     *
     * splitDocs
     *
     * while creating the Vector Store.
     *
     * -------------------------------------------------------------------------
     */

    /**
     * =============================================================================
     * End of Part 1
     * =============================================================================
     *
     * Next Part
     *
     * • OpenAIEmbeddings
     * • MemoryVectorStore
     * • Retriever
     * • Similarity Search
     * • Context Generation
     *
     * =============================================================================
     */
    /**
     * =========================================================================
     * Step 4
     * =========================================================================
     *
     * Create the Vector Store.
     *
     * A Vector Store is responsible for:
     *
     * • Storing embeddings
     * • Performing similarity search
     * • Returning relevant documents
     *
     * Workflow
     *
     * Documents
     *      │
     *      ▼
     * Embedding Model
     *      │
     *      ▼
     * Embedding Vectors
     *      │
     *      ▼
     * MemoryVectorStore
     *
     * =========================================================================
     */

    /**
     * Create an embedding model.
     *
     * OpenAIEmbeddings converts every
     * document into a high-dimensional
     * numerical vector.
     *
     * Example
     *
     * "Node.js is awesome"
     *
     * ↓
     *
     * [0.12, -0.56, 0.91, ...]
     *
     * NOTE:
     *
     * Every document receives its own vector.
     */
    const embeddings = new OpenAIEmbeddings();

    /**
     * Build an in-memory vector database.
     *
     * fromDocuments() performs several tasks:
     *
     * 1. Read every document.
     * 2. Generate embeddings.
     * 3. Store vectors in memory.
     *
     * NOTE:
     *
     * In production, use splitDocs instead of docs.
     *
     * Example
     *
     * await MemoryVectorStore.fromDocuments(
     *      splitDocs,
     *      embeddings
     * );
     */
    const vectorStore =
        await MemoryVectorStore.fromDocuments(
            docs,
            embeddings
        );

    console.log("Vector Store Created.\n");

    /**
     * =========================================================================
     * Step 5
     * =========================================================================
     *
     * Create a Retriever.
     *
     * A Retriever is responsible for
     * searching the Vector Store.
     *
     * It converts the user's query
     * into an embedding vector,
     * compares it against stored vectors,
     * and returns the most similar documents.
     *
     * Workflow
     *
     * User Question
     *      │
     *      ▼
     * Query Embedding
     *      │
     *      ▼
     * Similarity Search
     *      │
     *      ▼
     * Relevant Documents
     *
     * =========================================================================
     */
    const retriever =
        vectorStore.asRetriever();

    console.log("Retriever Created.\n");

    /**
     * =========================================================================
     * Step 6
     * =========================================================================
     *
     * User Question.
     *
     * This represents the question
     * asked by the user.
     *
     * The Retriever will search
     * for documents related
     * to this question.
     *
     * =========================================================================
     */
    const query =
        "How much money do I get for setting up my home office, and how do I submit the receipts?";

    console.log("User Question:");
    console.log(query);
    console.log("");

    /**
     * =========================================================================
     * Step 7
     * =========================================================================
     *
     * Retrieve Relevant Documents.
     *
     * The Retriever performs:
     *
     * Query
     *      │
     *      ▼
     * Embedding
     *      │
     *      ▼
     * Similarity Search
     *      │
     *      ▼
     * Top Matching Documents
     *
     * =========================================================================
     *
     * NOTE
     *
     * _getRelevantDocuments() is an internal method.
     *
     * For production applications,
     * use:
     *
     * await retriever.invoke(query)
     *
     * or
     *
     * await retriever.getRelevantDocuments(query)
     *
     * depending on your LangChain version.
     */
    const retrievedDocuments =
        await retriever._getRelevantDocuments(query);

    console.log(
        `${retrievedDocuments.length} relevant documents found.\n`
    );

    /**
     * =========================================================================
     * Step 8
     * =========================================================================
     *
     * Build Context.
     *
     * The retrieved documents are combined
     * into a single context string.
     *
     * This context will later be
     * inserted into the prompt.
     *
     * Example
     *
     * Document 1
     *
     * Document 2
     *
     * Document 3
     *
     * ↓
     *
     * One Context Block
     *
     * =========================================================================
     */
    const context = retrievedDocuments.map(
        (document, index) => {

            /**
             * Prefix each document
             * with its position.
             */
            return `${index + 1}. ${document.pageContent}`;

        }
    );

    /**
     * Display the generated context.
     */
    console.log("Generated Context:\n");

    console.log(context);

    console.log("");

    /**
     * -------------------------------------------------------------------------
     * Production Recommendation
     * -------------------------------------------------------------------------
     *
     * Instead of passing an array directly
     * into the prompt,
     * join all documents into
     * one formatted string.
     *
     * Example
     *
     * const context = retrievedDocuments
     *      .map(doc => doc.pageContent)
     *      .join("\n\n");
     *
     * This produces cleaner prompts
     * and better model responses.
     *
     * -------------------------------------------------------------------------
     */

    /**
     * =============================================================================
     * End of Part 2
     * =============================================================================
     *
     * Next Part
     *
     * • Prompt Construction
     * • ChatOpenAI
     * • invoke()
     * • Final Answer
     * • Program Entry Point
     *
     * =============================================================================
     */

    /**
     * =========================================================================
     * Step 9
     * =========================================================================
     *
     * Build the Final Prompt.
     *
     * The Large Language Model should NOT answer
     * using only its pretrained knowledge.
     *
     * Instead,
     * we provide:
     *
     * 1. System Instructions
     * 2. Retrieved Context
     * 3. User Question
     *
     * This is the "Generation" part
     * of Retrieval-Augmented Generation.
     *
     * =========================================================================
     */

    /**
     * Construct the final prompt.
     *
     * The retrieved documents become
     * the knowledge source.
     *
     * Current Prompt Structure
     *
     * -----------------------------------
     * You are a helpful assistant.
     *
     * Context:
     * ...
     *
     * Question:
     * ...
     * -----------------------------------
     */
    const finalPrompt = `
You are a helpful assistant.

Use ONLY the provided context to answer the user's question.

If the answer cannot be found in the context,
reply with:

"I couldn't find that information in the provided documents."

===========================
Context
===========================

${context}

===========================
Question
===========================

${query}

===========================
Answer
===========================
`;

    /**
     * -------------------------------------------------------------------------
     * Production Recommendation
     * -------------------------------------------------------------------------
     *
     * Instead of manually creating prompts
     * using template literals,
     * use ChatPromptTemplate.
     *
     * Example
     *
     * ChatPromptTemplate
     *
     * Context
     * Question
     *
     * ↓
     *
     * Final Prompt
     *
     * It improves:
     *
     * • Maintainability
     * • Reusability
     * • Readability
     *
     * -------------------------------------------------------------------------
     */

    /**
     * =========================================================================
     * Step 10
     * =========================================================================
     *
     * Create the Language Model.
     *
     * This model is responsible for
     * generating the final answer.
     *
     * Workflow
     *
     * Prompt
     *      │
     *      ▼
     * ChatOpenAI
     *      │
     *      ▼
     * GPT-4o-mini
     *      │
     *      ▼
     * Final Answer
     *
     * =========================================================================
     */

    const model = new ChatOpenAI({

        /**
         * OpenAI model.
         *
         * Fast and inexpensive,
         * making it suitable
         * for learning and production.
         */
        model: "gpt-4o-mini"

    });

    console.log("Language Model Initialized.\n");

    /**
     * =========================================================================
     * Step 11
     * =========================================================================
     *
     * Send the Prompt.
     *
     * invoke() sends
     * the final prompt
     * to the LLM.
     *
     * The model now has:
     *
     * ✔ User Question
     *
     * ✔ Retrieved Context
     *
     * Instead of relying only
     * on pretrained knowledge.
     *
     * =========================================================================
     */

    const answer =
        await model.invoke(finalPrompt);

    /**
     * =========================================================================
     * Step 12
     * =========================================================================
     *
     * Display the Final Answer.
     *
     * AIMessage
     *
     * ├── content
     * ├── metadata
     * └── token usage
     *
     * Here,
     * we only display
     * the generated content.
     *
     * =========================================================================
     */

    console.log("=======================================");
    console.log("Final Answer");
    console.log("=======================================\n");

    console.log(answer.content);

    console.log("\n");

    /**
     * =========================================================================
     * RAG Pipeline Summary
     * =========================================================================
     *
     * Knowledge Base
     *      │
     *      ▼
     * Documents
     *      │
     *      ▼
     * Embeddings
     *      │
     *      ▼
     * Vector Store
     *      │
     *      ▼
     * Retriever
     *      │
     *      ▼
     * Relevant Documents
     *      │
     *      ▼
     * Prompt
     *      │
     *      ▼
     * ChatOpenAI
     *      │
     *      ▼
     * Final Answer
     *
     * =========================================================================
     */

    console.log("RAG Pipeline Completed Successfully.");

};

/**
 * =============================================================================
 * Program Entry Point
 * =============================================================================
 *
 * Every Node.js application starts execution here.
 *
 * main()
 *
 * orchestrates the complete RAG pipeline.
 *
 * =============================================================================
 */

main();

/**
 * =============================================================================
 * End of Chapter 07
 * =============================================================================
 *
 * What You Learned
 *
 * ✔ Read documents from a knowledge base.
 *
 * ✔ Convert raw data into LangChain Documents.
 *
 * ✔ Split large documents.
 *
 * ✔ Generate embeddings.
 *
 * ✔ Store vectors.
 *
 * ✔ Create a Retriever.
 *
 * ✔ Perform semantic search.
 *
 * ✔ Build contextual prompts.
 *
 * ✔ Generate answers using retrieved knowledge.
 *
 * =============================================================================
 *
 * Production Improvements
 *
 * • Replace MemoryVectorStore
 *   with ChromaDB, Pinecone,
 *   Qdrant or Weaviate.
 *
 * • Use splitDocuments()
 *   before creating embeddings.
 *
 * • Replace manual prompts
 *   with ChatPromptTemplate.
 *
 * • Retrieve only the top-k
 *   relevant chunks.
 *
 * • Store metadata such as:
 *      - source
 *      - author
 *      - page number
 *      - category
 *
 * • Add citations to responses.
 *
 * • Cache embeddings.
 *
 * • Add retry logic.
 *
 * • Log latency and token usage.
 *
 * =============================================================================
 *
 * What's Next?
 *
 * Chapter 08
 *
 * Production RAG with ChromaDB
 *
 * Instead of storing vectors
 * in memory,
 * we'll use a persistent
 * Vector Database.
 *
 * Knowledge Base
 *      │
 *      ▼
 * ChromaDB
 *      │
 *      ▼
 * Retriever
 *      │
 *      ▼
 * Prompt Template
 *      │
 *      ▼
 * ChatOpenAI
 *      │
 *      ▼
 * Production-Ready AI Assistant
 *
 * =============================================================================
 */