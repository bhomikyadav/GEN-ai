# 📚 Chapter 07 - RAG (Retrieval-Augmented Generation) Basics

> Learn how to build your first **Retrieval-Augmented Generation (RAG)** application using **LangChain**, **OpenAI Embeddings**, and **MemoryVectorStore**.

---

# 📖 Overview

Until now, we have learned:

- Calling an LLM
- Chat Memory
- Function Calling
- Embeddings
- Vector Databases
- LangChain Basics

In this chapter, we combine all these concepts to build our first **RAG (Retrieval-Augmented Generation)** application.

Instead of asking the LLM directly, we first retrieve the most relevant information from our own documents and then provide that information as context to the model.

This allows the LLM to answer questions using **your own data** instead of relying only on its pre-trained knowledge.

---

# 🎯 Learning Objectives

After completing this chapter, you will understand:

- What is RAG?
- Why do we need RAG?
- What are Documents?
- What is a Text Splitter?
- What is a Retriever?
- What is a Vector Store?
- How LangChain builds a RAG pipeline
- How Context improves LLM responses
- Difference between Normal LLM and RAG

---

# 🧠 Prerequisites

Before starting this chapter, you should understand:

- TypeScript
- LangChain Basics
- Embeddings
- Vector Databases
- Prompt Engineering

Recommended Chapters

- ✅ Chapter 01 – Basic Model
- ✅ Chapter 02 – Chat Conversation Memory
- ✅ Chapter 03 – Function Calling
- ✅ Chapter 04 – Embeddings
- ✅ Chapter 05 – Vector Database with ChromaDB
- ✅ Chapter 06 – LangChain Basics

---

# 🤔 What is RAG?

RAG stands for

> **Retrieval-Augmented Generation**

Instead of answering directly,

the LLM first retrieves relevant information and then generates the answer.

Traditional Flow

```
Question
    │
    ▼
LLM
    │
    ▼
Answer
```

RAG Flow

```
Question
    │
    ▼
Retriever
    │
    ▼
Relevant Documents
    │
    ▼
LLM
    │
    ▼
Answer
```

---

# ❓ Why Do We Need RAG?

LLMs have limitations.

- They may hallucinate.
- Their knowledge can become outdated.
- They don't know your private documents.
- They cannot access company-specific knowledge by default.

RAG solves these problems by supplying relevant context before the model generates a response.

---

# 🏗️ Architecture

```
                 User Question
                        │
                        ▼
              OpenAI Embeddings
                        │
                        ▼
               Query Embedding
                        │
                        ▼
             Memory Vector Store
                        │
                        ▼
               Similar Documents
                        │
                        ▼
                 Build Context
                        │
                        ▼
                   Final Prompt
                        │
                        ▼
                  ChatOpenAI
                        │
                        ▼
                   Final Answer
```

---

# 📂 Project Structure

```
07-rag-basics/
│
├── README.md
├── CODE_EXPLANATION.md
├── src/
│   └── index.ts
├── data/
│   └── sample.json
└── images/
```

---

# ⚙️ Technologies Used

- TypeScript
- LangChain
- OpenAI
- OpenAI Embeddings
- MemoryVectorStore
- RecursiveCharacterTextSplitter
- dotenv

---

# 📦 Installation

```bash
npm install @langchain/openai
npm install @langchain/core
npm install @langchain/classic
npm install @langchain/textsplitters
npm install dotenv
```

---

# 🔐 Environment Variables

Create a `.env` file.

```env
OPEN_AI_API_KEY=your_openai_api_key
```

---

# 📚 Core Concepts

## 1. Documents

Every knowledge base starts with documents.

Example

```
Employee Handbook

Company Policies

Product Documentation

FAQ

PDF Files

JSON Files
```

LangChain converts them into `Document` objects.

---

## 2. Text Splitter

Large documents are difficult to embed efficiently.

The **RecursiveCharacterTextSplitter** breaks them into smaller chunks.

Example

```
Large Document

↓

Chunk 1

↓

Chunk 2

↓

Chunk 3
```

Smaller chunks improve retrieval quality.

---

## 3. Embeddings

Each chunk is converted into a vector.

```
Chunk

↓

Embedding Model

↓

Vector
```

Vectors capture semantic meaning rather than exact words.

---

## 4. Vector Store

The vectors are stored in a Vector Store.

In this chapter we use:

```
MemoryVectorStore
```

This stores vectors in RAM.

---

## 5. Retriever

The Retriever searches the Vector Store.

Instead of searching using keywords,

it searches using vector similarity.

```
Question

↓

Embedding

↓

Similarity Search

↓

Relevant Documents
```

---

## 6. Context

The retrieved documents become the **context**.

```
Document 1

Document 2

Document 3
```

These documents are added to the prompt before sending it to the LLM.

---

## 7. Generation

Finally,

the LLM generates an answer using both:

- User Question
- Retrieved Context

---

# 🔄 Complete Execution Flow

```
Application Starts
        │
        ▼
Load JSON Data
        │
        ▼
Create Documents
        │
        ▼
Split Documents
        │
        ▼
Generate Embeddings
        │
        ▼
Store Vectors
        │
        ▼
Create Retriever
        │
        ▼
User Question
        │
        ▼
Retrieve Similar Documents
        │
        ▼
Build Prompt
        │
        ▼
ChatOpenAI
        │
        ▼
Answer
```

---

# 💻 What This Project Does

This project demonstrates:

- Reading JSON data
- Creating LangChain Documents
- Splitting documents
- Creating embeddings
- Creating an in-memory vector store
- Retrieving relevant documents
- Building contextual prompts
- Generating answers using retrieved knowledge

---

# 📈 Example

Knowledge Base

```
Employees receive ₹15,000 as a home office setup allowance.
Receipts must be submitted within 30 days.
```

Question

```
How much money do I get for setting up my home office?
```

Retrieved Context

```
Employees receive ₹15,000 as a home office setup allowance.
```

Answer

```
Employees receive ₹15,000 as a home office setup allowance.
Receipts should be submitted within 30 days.
```

---

# ✅ Advantages

- Reduces hallucinations
- Uses your own data
- More accurate responses
- Easy to update knowledge
- No need to retrain the model
- Foundation for AI Assistants

---

# ❌ Limitations

- MemoryVectorStore is temporary
- Data is lost when the application stops
- Retrieval quality depends on chunking
- Embedding generation has API costs
- Context window size limits the amount of retrieved information

---

# 🏭 Production Considerations

For production systems:

- Replace `MemoryVectorStore` with a persistent vector database such as ChromaDB, Pinecone, or Qdrant.
- Use proper chunk sizes based on your document type.
- Store metadata (source, author, category, page number).
- Retrieve only the most relevant chunks.
- Cache embeddings to reduce costs.
- Add error handling and retries.
- Monitor latency and token usage.

---

# 💡 Best Practices

- Keep chunks reasonably small.
- Preserve context using chunk overlap.
- Use consistent embedding models for indexing and retrieval.
- Build prompts that instruct the model to answer only from the retrieved context.
- Store useful metadata with every document.

---

# ⚠️ Common Mistakes

❌ Skipping document chunking.

❌ Using very large chunks.

❌ Retrieving too many documents.

❌ Asking the model without retrieved context.

❌ Using different embedding models for indexing and querying.

---

# 🌍 Real-World Applications

RAG powers many AI systems, including:

- Enterprise Knowledge Bases
- AI Customer Support
- Internal Company Chatbots
- Legal Document Search
- Healthcare Knowledge Assistants
- Financial Advisory Systems
- Research Assistants
- Technical Documentation Search

---

# ❓ Interview Questions

## Beginner

1. What is RAG?
2. Why do we need RAG?
3. What is a Retriever?
4. What is a Vector Store?
5. Why are documents split into chunks?

---

## Intermediate

1. Explain the RAG pipeline.
2. How does a Retriever work?
3. Why are embeddings required?
4. What is chunk overlap?
5. What are the limitations of MemoryVectorStore?

---

## Advanced

1. How would you build a production-ready RAG system?
2. Why is retrieval quality important?
3. How would you optimize chunk size?
4. How would you reduce hallucinations in RAG?
5. How would you replace MemoryVectorStore with ChromaDB?

---

# 📖 Summary

In this chapter, you built your first Retrieval-Augmented Generation (RAG) application.

You learned how to:

- Load documents
- Split text into chunks
- Generate embeddings
- Store vectors
- Retrieve relevant information
- Build contextual prompts
- Generate answers using your own data

This chapter is the foundation for modern AI assistants because it enables LLMs to answer questions using external knowledge instead of relying only on their pre-trained data.

---

# ⏭️ What's Next?

In the next chapter, we'll build a **production-ready RAG pipeline** using a persistent vector database such as **ChromaDB**, allowing the knowledge base to survive application restarts and scale to much larger datasets.
