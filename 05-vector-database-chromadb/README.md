# 🗄️ Chapter 05 - Vector Database with ChromaDB

> Learn how to store, index, and retrieve embeddings efficiently using **ChromaDB**, an open-source vector database designed for AI applications.

---

# 📖 Overview

In the previous chapter, we learned how to generate embeddings using OpenAI and manually compare them using **Dot Product** and **Cosine Similarity**.

While this approach works well for a few documents, it becomes impractical when dealing with thousands or millions of embeddings.

This is where **Vector Databases** come into the picture.

A vector database stores embedding vectors and provides extremely fast similarity search without comparing every vector manually.

In this chapter, you'll integrate **ChromaDB** with the OpenAI Embeddings API to build your first semantic search application.

---

# 🎯 Learning Objectives

After completing this chapter, you will understand:

- What a Vector Database is.
- Why traditional databases are not suitable for vector search.
- What ChromaDB is.
- How ChromaDB stores embeddings.
- What Collections are.
- What Embedding Functions are.
- How semantic search works.
- How to add documents.
- How to query similar documents.
- The complete lifecycle of vector search.

---

# 🧠 Prerequisites

Before starting this chapter, you should understand:

- TypeScript
- OpenAI SDK
- Embeddings
- Cosine Similarity
- Async/Await

Recommended previous chapters:

- ✅ Chapter 01 - Basic Model
- ✅ Chapter 02 - Chat Conversation Memory
- ✅ Chapter 03 - Function Calling
- ✅ Chapter 04 - Embeddings

---

# 🤔 Why Do We Need a Vector Database?

Imagine storing **1 million documents**.

Without a vector database:

```
User Query

↓

Generate Embedding

↓

Compare with Document 1

↓

Compare with Document 2

↓

Compare with Document 3

↓

...

↓

Compare with Document 1,000,000
```

This approach is extremely slow.

A vector database solves this problem by building specialized indexes that allow similarity searches to complete in milliseconds.

---

# 🧠 What is a Vector Database?

A Vector Database is a specialized database designed to store and search **high-dimensional vectors (embeddings)**.

Unlike relational databases, which search using exact values, vector databases search using **semantic similarity**.

Instead of asking:

```
Find documents containing the word "cookies".
```

you can ask:

```
Find documents that have a similar meaning to:

"How do I bake cookies at home?"
```

---

# 🗂️ What is ChromaDB?

ChromaDB is an open-source vector database built specifically for AI applications.

It provides:

- Vector Storage
- Similarity Search
- Collections
- Metadata Storage
- Embedding Integration
- Fast Retrieval

ChromaDB can automatically generate embeddings if an embedding function is provided.

---

# 🏗️ Project Architecture

```
                  User Query
                       │
                       ▼
          OpenAI Embedding Function
                       │
                       ▼
               Query Embedding
                       │
                       ▼
                  ChromaDB
      ┌────────────────┴────────────────┐
      ▼                                 ▼
Stored Document Embeddings       Vector Index
      │                                 │
      └────────────────┬────────────────┘
                       ▼
             Similarity Search
                       │
                       ▼
         Most Relevant Documents
```

---

# 📂 Project Structure

```
05-vector-database-chromadb/
│
├── README.md
├── CODE_EXPLANATION.md
├── src/
│   └── index.ts
├── docker-compose.yml
└── images/
```

---

# ⚙️ Technologies Used

- TypeScript
- Node.js
- OpenAI SDK
- ChromaDB
- dotenv

---

# 📦 Installation

Install project dependencies.

```bash
npm install openai chromadb dotenv
```

---

# 🐳 Running ChromaDB

Start ChromaDB using Docker.

```bash
docker run -p 8000:8000 chromadb/chroma
```

Once started,

ChromaDB will be available at:

```
http://localhost:8000
```

---

# 🔐 Environment Variables

Create a `.env` file.

```env
OPEN_AI_API_KEY=your_api_key_here
```

Never commit API keys to GitHub.

---

# 📚 Core Concepts

## 1. Embedding Function

An Embedding Function converts text into vectors.

Instead of manually generating embeddings every time,

ChromaDB can call the embedding function automatically.

Example:

```
Text

↓

OpenAI Embedding Model

↓

Vector
```

---

## 2. Collection

A Collection is similar to a table in SQL or a collection in MongoDB.

Example:

```
my_test_collection
```

A collection stores:

- Documents
- IDs
- Embeddings
- Metadata

---

## 3. Documents

Documents represent the original text.

Example:

```
Artificial intelligence is changing industries.
```

The document is stored together with its embedding.

---

## 4. IDs

Every document requires a unique identifier.

Example:

```
1

2

3
```

---

## 5. Semantic Search

Instead of matching keywords,

ChromaDB compares embedding vectors.

Example:

Stored document

```
A delicious recipe for homemade chocolate chip cookies.
```

User query

```
How do I bake cookies at home?
```

Although the words differ,

the meanings are similar.

Therefore,

the document is returned.

---

# 🔄 Execution Flow

```
Application Starts
        │
        ▼
Create OpenAI Client
        │
        ▼
Connect to ChromaDB
        │
        ▼
Create Collection
        │
        ▼
Register Embedding Function
        │
        ▼
Add Documents
        │
        ▼
Generate Embeddings
        │
        ▼
Store Vectors
        │
        ▼
User Query
        │
        ▼
Generate Query Embedding
        │
        ▼
Similarity Search
        │
        ▼
Return Matching Documents
```

---

# 💻 What This Project Does

This application performs the following steps:

1. Creates an OpenAI embedding function.
2. Connects to ChromaDB.
3. Creates a collection.
4. Stores multiple documents.
5. Automatically generates embeddings.
6. Stores embeddings in ChromaDB.
7. Accepts a search query.
8. Generates an embedding for the query.
9. Searches for semantically similar documents.
10. Returns the most relevant results.

---

# 📈 Example

Stored Documents

```
The quick brown fox jumps over the lazy dog.
```

```
Artificial intelligence and machine learning are shifting industries.
```

```
A delicious recipe for homemade chocolate chip cookies.
```

Query

```
How do you bake cookies at home?
```

Result

```
A delicious recipe for homemade chocolate chip cookies.
```

Even though the words don't exactly match,

the meanings are similar.

---

# ✅ Advantages

- Extremely fast similarity search.
- Supports millions of vectors.
- Automatic embedding generation.
- Easy integration with OpenAI.
- Foundation for Retrieval-Augmented Generation (RAG).
- Supports metadata filtering.
- Scalable architecture.

---

# ❌ Limitations

- Requires a running ChromaDB server.
- Embedding generation incurs API costs.
- Large collections require more storage.
- Query quality depends on the embedding model.
- Additional infrastructure compared to traditional databases.

---

# 🏭 Production Considerations

For production systems:

- Create the collection only once during application startup.
- Cache the collection instance instead of calling `getOrCreateCollection()` repeatedly.
- Store metadata alongside documents.
- Batch document inserts.
- Handle connection failures gracefully.
- Monitor embedding generation costs.
- Backup vector data regularly.
- Secure ChromaDB if exposed over a network.

---

# 💡 Best Practices

- Use meaningful collection names.
- Keep document IDs unique.
- Store useful metadata.
- Batch insert documents.
- Validate embedding generation.
- Reuse the same embedding model for indexing and querying.
- Handle API errors using `try...catch`.

---

# ⚠️ Common Mistakes

❌ Creating a new collection for every request.

❌ Using different embedding models for indexing and querying.

❌ Forgetting to persist vectors.

❌ Ignoring metadata.

❌ Storing duplicate document IDs.

❌ Expecting keyword search behavior from semantic search.

---

# 🌍 Real-World Applications

Vector databases power many AI systems, including:

- Retrieval-Augmented Generation (RAG)
- AI Chatbots
- Semantic Search Engines
- Enterprise Knowledge Bases
- Product Recommendations
- Question Answering Systems
- Customer Support Assistants
- Similar Document Detection
- Personalized Search

---

# ❓ Interview Questions

## Beginner

1. What is a vector database?
2. Why do we need a vector database?
3. What is ChromaDB?
4. What is a collection?
5. What is an embedding function?

---

## Intermediate

1. How does semantic search differ from keyword search?
2. Why should the same embedding model be used for indexing and querying?
3. What happens when a new document is added?
4. Why is metadata useful?
5. What are the benefits of batching inserts?

---

## Advanced

1. How does a vector database scale to millions of embeddings?
2. Why is Approximate Nearest Neighbor (ANN) search preferred over brute-force comparison?
3. How would you build a Retrieval-Augmented Generation (RAG) pipeline using ChromaDB?
4. How would you update embeddings when documents change?
5. How would you optimize latency for large vector collections?

---

# 📖 Summary

In this chapter, you learned how to use ChromaDB as a vector database to store and search embeddings efficiently.

You explored:

- Vector Databases
- ChromaDB
- Collections
- Embedding Functions
- Semantic Search
- Automatic Embedding Generation
- Similarity Search
- Document Retrieval

This chapter bridges the gap between embedding generation and real-world AI applications by introducing the storage and retrieval layer required for scalable semantic search.

---

# ⏭️ What's Next?

In the next chapter, we'll build a **Retrieval-Augmented Generation (RAG)** system that combines vector search with Large Language Models to answer questions using your own documents instead of relying only on the model's built-in knowledge.
