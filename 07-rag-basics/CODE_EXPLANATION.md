# 📄 CODE_EXPLANATION.md

> **Chapter 07 - RAG (Retrieval-Augmented Generation) Basics**

This document explains every part of the code in detail. By the end of this chapter, you'll understand how a **Retrieval-Augmented Generation (RAG)** pipeline works using **LangChain**, **OpenAI Embeddings**, and **MemoryVectorStore**.

---

# 📚 What is Retrieval-Augmented Generation (RAG)?

Retrieval-Augmented Generation (RAG) is an AI architecture that combines **information retrieval** with **Large Language Models (LLMs)**.

Instead of asking an LLM to answer using only its pre-trained knowledge, we first retrieve relevant information from our own documents and then provide that information as context.

Traditional LLM

```
Question
    │
    ▼
Large Language Model
    │
    ▼
Answer
```

RAG

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
Prompt
    │
    ▼
Large Language Model
    │
    ▼
Answer
```

---

# 🤔 Why Do We Need RAG?

Large Language Models have several limitations:

- They don't know your private documents.
- They may hallucinate.
- Their knowledge becomes outdated.
- They cannot answer organization-specific questions unless provided with context.

RAG solves these problems by retrieving relevant documents before generating an answer.

---

# 🔄 Complete Execution Flow

```
Application Starts
        │
        ▼
Load Environment Variables
        │
        ▼
Read JSON File
        │
        ▼
Create LangChain Documents
        │
        ▼
Split Documents
        │
        ▼
Generate Embeddings
        │
        ▼
Store Embeddings
        │
        ▼
Create Retriever
        │
        ▼
Receive User Question
        │
        ▼
Generate Query Embedding
        │
        ▼
Retrieve Similar Documents
        │
        ▼
Build Context
        │
        ▼
Create Prompt
        │
        ▼
ChatOpenAI
        │
        ▼
Final Answer
```

---

# 1️⃣ Importing Required Libraries

```ts
import { configDotenv } from "dotenv";
```

Loads environment variables.

---

```ts
import { readFileSync } from "fs";
```

Reads the JSON file containing the knowledge base.

---

```ts
import { join } from "path";
```

Creates operating-system-independent file paths.

---

```ts
import { RecursiveCharacterTextSplitter }
```

Splits large documents into smaller chunks.

---

```ts
import { Document }
```

Represents a document inside LangChain.

---

```ts
import { MemoryVectorStore }
```

Stores embeddings in memory.

---

```ts
import {
OpenAIEmbeddings,
ChatOpenAI
}
```

Provides:

- Embedding Model
- Chat Model

---

# 2️⃣ Loading Environment Variables

```ts
configDotenv();
```

Loads the `.env` file.

Example

```env
OPEN_AI_API_KEY=sk-xxxxxxxx
```

Without this, the OpenAI SDK cannot authenticate requests.

---

# 3️⃣ Reading the Knowledge Base

```ts
readFileSync(...)
```

Reads

```
sample.json
```

Example

```json
[
  {
    "id": 1,
    "title": "Office Policy",
    "content": "Employees receive ₹15,000..."
  }
]
```

This file acts as the application's knowledge base.

---

# 4️⃣ Creating LangChain Documents

```ts
new Document(...)
```

LangChain works with `Document` objects rather than raw strings.

Each document contains:

- pageContent
- metadata

Example

```text
Document

├── pageContent
└── metadata
```

Metadata helps identify the source of retrieved information.

---

# 5️⃣ Metadata

```ts
metadata: {
  (id, title);
}
```

Metadata is not sent directly to the model.

Instead, it provides additional information such as:

- Document ID
- Source
- Author
- Category
- Page Number

This becomes useful in larger RAG systems.

---

# 6️⃣ RecursiveCharacterTextSplitter

```ts
RecursiveCharacterTextSplitter;
```

Large documents are difficult to retrieve accurately.

The splitter divides them into overlapping chunks.

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

---

# 7️⃣ Chunk Size

```ts
chunkSize: 100;
```

Controls the maximum size of each chunk.

Smaller chunks improve retrieval precision but increase the number of vectors.

---

# 8️⃣ Chunk Overlap

```ts
chunkOverlap: 20;
```

Maintains context between neighboring chunks.

Example

Without overlap

```
Chunk 1

ABCDE
```

```
Chunk 2

FGHIJ
```

With overlap

```
Chunk 1

ABCDEFG
```

```
Chunk 2

EFGHIJK
```

Overlap prevents important information from being split across chunk boundaries.

---

# 9️⃣ Important Observation

In the current code, the splitter is created but **not used**.

You should split the documents before creating the vector store.

Instead of

```ts
const docs = ...
```

use

```ts
const splitDocs = await splitter.splitDocuments(docs);
```

Then create the vector store using

```ts
splitDocs;
```

Otherwise,

`chunkSize` and `chunkOverlap` have no effect.

---

# 🔟 MemoryVectorStore

```ts
MemoryVectorStore;
```

Stores embeddings entirely in RAM.

Flow

```
Documents

↓

Embeddings

↓

Memory
```

When the application stops,

everything is lost.

Production systems use persistent vector databases such as ChromaDB or Pinecone.

---

# 1️⃣1️⃣ OpenAIEmbeddings

```ts
new OpenAIEmbeddings();
```

Automatically converts every document into a vector.

```
Document

↓

Embedding Model

↓

Vector
```

This happens internally when the vector store is created.

---

# 1️⃣2️⃣ Retriever

```ts
vectorStore.asRetriever();
```

Creates a Retriever.

The Retriever performs semantic search over the stored vectors.

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

# 1️⃣3️⃣ Query

```ts
How much money do I get...
```

The user asks a natural language question.

The Retriever converts the question into an embedding before searching.

---

# 1️⃣4️⃣ Retrieving Documents

```ts
_getRelevantDocuments(...)
```

Returns the most relevant documents.

> **Note:** `_getRelevantDocuments()` is an internal method (indicated by the leading underscore). Prefer using the public API such as `retriever.invoke(query)` (or `getRelevantDocuments(query)` in versions where it's available) to reduce the risk of breaking changes.

---

# 1️⃣5️⃣ Context Creation

```ts
result.map(...)
```

The retrieved documents are combined into a single context.

Example

```
Document 1

Document 2

Document 3
```

↓

```
Context
```

The context is later injected into the prompt.

---

# 1️⃣6️⃣ Prompt Engineering

```ts
const finalPrompt = ...
```

The prompt contains:

- System Instructions
- Retrieved Context
- User Question

Example

```
Context

↓

Question

↓

LLM

↓

Answer
```

For production systems, consider using a `ChatPromptTemplate` rather than manual string interpolation.

---

# 1️⃣7️⃣ ChatOpenAI

```ts
new ChatOpenAI(...)
```

Creates the chat model.

The model receives the final prompt and generates the answer.

---

# 1️⃣8️⃣ invoke()

```ts
model.invoke(...)
```

Sends the prompt to the LLM.

Input

```
Prompt
```

↓

Output

```
AI Response
```

---

# 📊 Overall Workflow

```
Knowledge Base

↓

Documents

↓

Text Splitter

↓

Chunks

↓

Embeddings

↓

Memory Vector Store

↓

Retriever

↓

Relevant Chunks

↓

Prompt

↓

ChatOpenAI

↓

Final Answer
```

---

# 🌍 Real-World Applications

This same architecture powers:

- Enterprise Knowledge Assistants
- Internal Company Chatbots
- AI Customer Support
- Technical Documentation Search
- Legal Document Search
- Healthcare Knowledge Systems
- Research Assistants
- Financial Advisory Chatbots

---

# ⚠️ Current Limitations

This implementation is designed for learning.

Some limitations include:

- `MemoryVectorStore` is temporary.
- The text splitter is instantiated but not applied to the documents.
- An internal retriever method is used instead of the public API.
- Prompt construction uses string interpolation instead of a prompt template.
- No error handling.
- No metadata filtering.
- No persistent storage.

---

# 🏭 Production Improvements

A production-ready RAG system should:

- Use `splitDocuments()` before indexing.
- Store vectors in ChromaDB, Pinecone, or Qdrant.
- Use `ChatPromptTemplate` for prompt creation.
- Retrieve only the top **k** most relevant chunks.
- Cache embeddings.
- Add logging and monitoring.
- Handle API failures with retries.
- Include document sources in responses when appropriate.

---

# 📌 Key Takeaways

After completing this chapter, you should understand:

- What Retrieval-Augmented Generation (RAG) is.
- Why RAG is used instead of querying an LLM directly.
- How LangChain `Document` objects represent knowledge.
- Why text splitting improves retrieval quality.
- How embeddings and a vector store enable semantic search.
- How a Retriever finds relevant context.
- How retrieved context is incorporated into a prompt.
- Why RAG forms the foundation of modern AI assistants and enterprise knowledge systems.
