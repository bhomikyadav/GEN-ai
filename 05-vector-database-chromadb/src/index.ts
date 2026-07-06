/**
 * =============================================================================
 * Chapter 05 - Vector Database with ChromaDB
 * =============================================================================
 *
 * Description
 * -----------------------------------------------------------------------------
 * In the previous chapter, we generated embeddings manually and compared them
 * using mathematical algorithms like Dot Product and Cosine Similarity.
 *
 * While that approach works for small datasets, it becomes inefficient when
 * dealing with thousands or millions of documents.
 *
 * This chapter introduces ChromaDB, an open-source Vector Database that stores,
 * indexes, and retrieves embeddings efficiently.
 *
 * Instead of manually calculating similarity, ChromaDB performs vector search
 * internally and returns the most relevant documents.
 *
 * -----------------------------------------------------------------------------
 * Topics Covered
 * -----------------------------------------------------------------------------
 *
 * • OpenAI Embeddings
 * • ChromaDB
 * • Collections
 * • Embedding Functions
 * • Semantic Search
 * • Vector Storage
 * • Similarity Search
 *
 * =============================================================================
 *
 * High-Level Architecture
 *
 *                 User Query
 *                      │
 *                      ▼
 *            OpenAI Embedding Model
 *                      │
 *                      ▼
 *              Query Embedding Vector
 *                      │
 *                      ▼
 *                 ChromaDB Collection
 *                      │
 *                      ▼
 *              Similarity Search
 *                      │
 *                      ▼
 *           Most Relevant Documents
 *
 * =============================================================================
 */

import { OpenAI } from "openai";
import { configDotenv } from "dotenv";

import {
    ChromaClient,
    EmbeddingFunction
} from "chromadb";

/**
 * -----------------------------------------------------------------------------
 * Load Environment Variables
 * -----------------------------------------------------------------------------
 *
 * Reads variables from the `.env` file and loads them into `process.env`.
 *
 * Required:
 *
 * OPEN_AI_API_KEY=<your_api_key>
 *
 * Without this call,
 * process.env.OPEN_AI_API_KEY
 * will be undefined.
 * -----------------------------------------------------------------------------
 */
configDotenv();

/**
 * -----------------------------------------------------------------------------
 * OpenAI Client
 * -----------------------------------------------------------------------------
 *
 * Creates an authenticated client that communicates with OpenAI's REST API.
 *
 * This client is responsible for generating embeddings.
 *
 * Every request sent to OpenAI passes through this object.
 * -----------------------------------------------------------------------------
 */
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
});

/**
 * =============================================================================
 * Custom Embedding Function
 * =============================================================================
 *
 * ChromaDB allows developers to provide their own embedding generator.
 *
 * Instead of manually generating embeddings before inserting documents,
 * ChromaDB can automatically call this class whenever embeddings are needed.
 *
 * Flow
 *
 * Text
 *   │
 *   ▼
 * OpenAI Embedding API
 *   │
 *   ▼
 * Vector
 *   │
 *   ▼
 * ChromaDB
 *
 * =============================================================================
 */

/**
 * Custom embedding provider.
 *
 * This class implements ChromaDB's EmbeddingFunction interface.
 *
 * Whenever ChromaDB needs embeddings,
 * it automatically calls the generate() function.
 */
class OpenaiEmbedding implements EmbeddingFunction {

    /**
     * -------------------------------------------------------------------------
     * Generates embeddings for multiple documents.
     * -------------------------------------------------------------------------
     *
     * ChromaDB passes an array of text documents.
     *
     * Example
     *
     * [
     *   "Node.js",
     *   "Redis",
     *   "Docker"
     * ]
     *
     * The OpenAI Embedding API returns
     * one embedding vector for each document.
     *
     * Returned Example
     *
     * [
     *   [0.123, -0.554, ...],
     *   [0.441, 0.112, ...],
     *   [0.721, -0.019, ...]
     * ]
     *
     * @param texts Array of text documents.
     *
     * @returns Array of embedding vectors.
     * -------------------------------------------------------------------------
     */
    async generate(
        texts: string[]
    ): Promise<number[][]> {

        /**
         * Send all documents to the embedding model.
         *
         * The API generates one embedding
         * for every string in the array.
         */
        const response =
            await openai.embeddings.create({

                /**
                 * Embedding model.
                 *
                 * Optimized for semantic search
                 * while remaining cost-effective.
                 */
                model: "text-embedding-3-small",

                /**
                 * Input text.
                 *
                 * Example
                 *
                 * [
                 *   "Hello",
                 *   "Node.js"
                 * ]
                 */
                input: texts

            });

        /**
         * Convert OpenAI's response into the format
         * expected by ChromaDB.
         *
         * OpenAI returns:
         *
         * {
         *   data: [
         *      {
         *          embedding: [...]
         *      }
         *   ]
         * }
         *
         * ChromaDB expects:
         *
         * [
         *    [...],
         *    [...]
         * ]
         */
        return response.data.map(
            (item) => item.embedding
        );

    }

}

/**
 * =============================================================================
 * ChromaDB Client
 * =============================================================================
 *
 * Creates a connection to the ChromaDB server.
 *
 * This client is responsible for:
 *
 * • Creating Collections
 * • Retrieving Collections
 * • Adding Documents
 * • Querying Documents
 * • Managing Embeddings
 *
 * =============================================================================
 */
const chromaClient = new ChromaClient({

    /**
     * ChromaDB server hostname.
     *
     * Since we're running ChromaDB locally,
     * the host is localhost.
     */
    host: "localhost",

    /**
     * Default ChromaDB server port.
     */
    port: 8000

});

/**
 * -----------------------------------------------------------------------------
 * Health Check
 * -----------------------------------------------------------------------------
 *
 * heartbeat() verifies that the ChromaDB server
 * is reachable and responding.
 *
 * Think of it as:
 *
 * Application
 *      │
 *      ▼
 * "Are you alive?"
 *      │
 *      ▼
 * ChromaDB
 *      │
 *      ▼
 * "Yes!"
 *
 * In production, the returned value should be checked
 * before performing database operations.
 * -----------------------------------------------------------------------------
 */
chromaClient.heartbeat();

/**
 * =============================================================================
 * End of Part 1
 * =============================================================================
 *
 * Next Part
 *
 * • init()
 * • getOrCreateCollection()
 * • addMessages()
 * • getSimilarMessage()
 *
 * =============================================================================
 */

/**
 * =============================================================================
 * Collection Initialization
 * =============================================================================
 *
 * Before storing or querying documents,
 * we need a Collection.
 *
 * A Collection in ChromaDB is similar to:
 *
 * SQL
 * ↓
 * Table
 *
 * MongoDB
 * ↓
 * Collection
 *
 * The Collection stores:
 *
 * • Documents
 * • Embeddings
 * • Metadata
 * • IDs
 *
 * =============================================================================
 */

/**
 * Creates (or retrieves) a ChromaDB collection.
 *
 * Why "getOrCreateCollection"?
 *
 * Imagine running the application twice.
 *
 * First Run
 * ----------
 * Collection doesn't exist
 *
 * ↓
 *
 * Create Collection
 *
 * Second Run
 * -----------
 * Collection already exists
 *
 * ↓
 *
 * Return Existing Collection
 *
 * This prevents duplicate collections.
 *
 * -----------------------------------------------------------------------------
 * Flow
 *
 * Application
 *      │
 *      ▼
 * Collection Exists?
 *      │
 * ┌────┴─────┐
 * ▼          ▼
 * Yes        No
 * │          │
 * ▼          ▼
 * Return     Create
 * Collection Collection
 *
 * -----------------------------------------------------------------------------
 */
const init = async () => {

    /**
     * Create an instance of our custom
     * OpenAI embedding provider.
     *
     * ChromaDB will call this object
     * whenever embeddings are required.
     */
    const embedder = new OpenaiEmbedding();

    /**
     * Create or retrieve the collection.
     *
     * Collection Name:
     *
     * my_test_collection
     *
     * Every document added to this
     * collection will use the custom
     * embedding function.
     */
    const collection =
        await chromaClient.getOrCreateCollection({

            /**
             * Unique collection name.
             */
            name: "my_test_collection",

            /**
             * Custom embedding provider.
             *
             * ChromaDB automatically calls
             * generate() whenever vectors
             * are required.
             */
            embeddingFunction: embedder

        });

    /**
     * Return the collection.
     */
    return collection;

};

/**
 * =============================================================================
 * Add Documents
 * =============================================================================
 *
 * This function inserts a new document
 * into ChromaDB.
 *
 * Flow
 *
 * Document
 *     │
 *     ▼
 * Collection
 *     │
 *     ▼
 * Embedding Function
 *     │
 *     ▼
 * OpenAI
 *     │
 *     ▼
 * Embedding Vector
 *     │
 *     ▼
 * Stored Inside ChromaDB
 *
 * =============================================================================
 */

/**
 * Adds a document to the collection.
 *
 * Unlike the previous chapter,
 * we DO NOT manually generate embeddings.
 *
 * ChromaDB automatically calls our
 * custom embedding function.
 *
 * @param id Unique document identifier.
 * @param text Document content.
 */
const addMessages = async (
    id: string,
    text: string
): Promise<void> => {

    /**
     * Retrieve the collection.
     */
    const collection = await init();

    /**
     * Insert the document.
     *
     * ChromaDB performs:
     *
     * Text
     * ↓
     * Embedding
     * ↓
     * Storage
     *
     * automatically.
     */
    await collection.add({

        /**
         * Every document requires
         * a unique identifier.
         */
        ids: [id],

        /**
         * Original document text.
         *
         * The embedding function
         * converts this into a vector.
         */
        documents: [text],

    });

    /**
     * Log success.
     */
    console.log(
        `Added Document\nID: ${id}\nContent: ${text}\n`
    );

};

/**
 * =============================================================================
 * Semantic Search
 * =============================================================================
 *
 * This function searches for documents
 * that have similar meanings.
 *
 * IMPORTANT
 *
 * We do NOT compare strings.
 *
 * We compare vectors.
 *
 * Flow
 *
 * Query
 *   │
 *   ▼
 * Embedding Function
 *   │
 *   ▼
 * Query Vector
 *   │
 *   ▼
 * ChromaDB
 *   │
 *   ▼
 * Vector Search
 *   │
 *   ▼
 * Most Similar Documents
 *
 * =============================================================================
 */

/**
 * Searches for documents that are
 * semantically similar to the query.
 *
 * Example
 *
 * Stored Document
 *
 * "A delicious recipe for homemade
 * chocolate chip cookies."
 *
 * Query
 *
 * "How do I bake cookies?"
 *
 * Although the wording differs,
 * the meanings are similar,
 * so ChromaDB returns the document.
 *
 * @param text Search query.
 * @param limit Number of results.
 *
 * @returns Matching documents.
 */
const getSimilarMessage = async (
    text: string,
    limit: number = 5
) => {

    /**
     * Retrieve collection.
     */
    const collection = await init();

    /**
     * Perform semantic search.
     *
     * queryTexts
     *
     * Plain text query.
     *
     * ChromaDB automatically:
     *
     * Query
     * ↓
     * Embedding
     * ↓
     * Vector Search
     * ↓
     * Results
     */
    const result =
        await collection.query({

            /**
             * Query document.
             */
            queryTexts: [text],

            /**
             * Maximum number
             * of matching documents.
             */
            nResults: limit

        });

    /**
     * Display matching documents.
     */
    console.log(
        "========================================"
    );

    console.log(
        "Semantic Search Results"
    );

    console.log(
        "========================================"
    );

    console.log(
        `Query:\n${text}\n`
    );

    console.log(
        "Matched Documents:"
    );

    console.log(
        result.documents[0]
    );

    console.log("");

    /**
     * Return matching documents.
     */
    return result.documents[0];

};

/**
 * =============================================================================
 * End of Part 2
 * =============================================================================
 *
 * Next Part
 *
 * • Sample Data
 * • run()
 * • Complete Execution Flow
 * • Production Improvements
 *
 * =============================================================================
 */

/**
 * =============================================================================
 * Sample Dataset
 * =============================================================================
 *
 * The following dataset is used for demonstrating semantic search.
 *
 * Although these documents contain completely different topics,
 * ChromaDB can determine which document is semantically closest
 * to the user's query.
 *
 * Example
 *
 * ID 1
 * ----
 * The quick brown fox jumps over the lazy dog.
 *
 * ID 2
 * ----
 * Artificial intelligence and machine learning are shifting industries.
 *
 * ID 3
 * ----
 * A delicious recipe for homemade chocolate chip cookies.
 *
 * =============================================================================
 */

/**
 * Sample Data
 *
 * Uncomment this array if you want to insert
 * multiple documents dynamically.
 *
 * const data = [
 *   {
 *      id:1,
 *      text:"..."
 *   }
 * ]
 */

/**
 * =============================================================================
 * Application Entry Point
 * =============================================================================
 *
 * The run() function orchestrates the complete
 * semantic search workflow.
 *
 * Overall Workflow
 *
 * Create Collection
 *        │
 *        ▼
 * Insert Documents
 *        │
 *        ▼
 * Generate Embeddings
 *        │
 *        ▼
 * Store Embeddings
 *        │
 *        ▼
 * User Query
 *        │
 *        ▼
 * Query Embedding
 *        │
 *        ▼
 * Similarity Search
 *        │
 *        ▼
 * Return Matching Documents
 *
 * =============================================================================
 */

/**
 * Executes the complete Vector Database example.
 *
 * Responsibilities
 *
 * 1. Insert sample documents.
 * 2. Generate embeddings automatically.
 * 3. Store embeddings inside ChromaDB.
 * 4. Perform semantic search.
 * 5. Display matching documents.
 */
const run = async (): Promise<void> => {

    console.log("========================================");
    console.log("Chapter 05 - ChromaDB");
    console.log("========================================\n");

    /**
     * -------------------------------------------------------------------------
     * Step 1
     *
     * Insert sample documents.
     * -------------------------------------------------------------------------
     *
     * ChromaDB automatically performs:
     *
     * Text
     *   │
     *   ▼
     * Embedding Function
     *   │
     *   ▼
     * OpenAI
     *   │
     *   ▼
     * Embedding Vector
     *   │
     *   ▼
     * Store Inside Collection
     */

    await addMessages(
        "1",
        "The quick brown fox jumps over the lazy dog."
    );

    await addMessages(
        "2",
        "Artificial intelligence and machine learning are shifting industries."
    );

    await addMessages(
        "3",
        "A delicious recipe for homemade chocolate chip cookies."
    );

    console.log("Documents successfully stored.\n");

    /**
     * -------------------------------------------------------------------------
     * Step 2
     *
     * Semantic Search
     * -------------------------------------------------------------------------
     *
     * User asks a question.
     *
     * Instead of searching using keywords,
     * ChromaDB converts the query into
     * an embedding vector.
     *
     * It then compares the query vector
     * against every stored vector.
     */

    const result =
        await getSimilarMessage(

            /**
             * User query.
             */
            "How do you bake cookies at home?",

            /**
             * Return the top 5 matches.
             */
            5

        );

    /**
     * -------------------------------------------------------------------------
     * Step 3
     *
     * Display Results
     * -------------------------------------------------------------------------
     */

    console.log(
        "========================================"
    );

    console.log(
        "Final Search Result"
    );

    console.log(
        "========================================"
    );

    console.table(result);

    console.log("\nSemantic search completed successfully.");
};

/**
 * =============================================================================
 * Program Entry Point
 * =============================================================================
 *
 * Every Node.js application begins execution here.
 *
 * Calling run()
 *
 * starts the entire semantic search pipeline.
 *
 * =============================================================================
 */

run();

/**
 * =============================================================================
 * End of Chapter 05
 * =============================================================================
 *
 * What You Learned
 *
 * ✓ What a Vector Database is.
 *
 * ✓ Why embeddings should be stored.
 *
 * ✓ How ChromaDB automatically generates embeddings.
 *
 * ✓ Collections.
 *
 * ✓ Embedding Functions.
 *
 * ✓ Semantic Search.
 *
 * ✓ Query Embeddings.
 *
 * ✓ Similarity Search.
 *
 * =============================================================================
 *
 * Next Chapter
 *
 * Retrieval-Augmented Generation (RAG)
 *
 * Instead of asking the LLM directly,
 * we'll first retrieve relevant documents
 * from ChromaDB and provide them as context
 * to the language model.
 *
 * This is the foundation of modern AI Assistants.
 *
 * =============================================================================
 */