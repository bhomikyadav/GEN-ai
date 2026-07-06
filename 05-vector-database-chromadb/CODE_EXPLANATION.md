# 📄 CODE_EXPLANATION.md

> **Chapter 05 - Vector Database with ChromaDB**

This document explains every part of the code in detail. You'll learn not only **what** each function does, but also **why** it exists and **how ChromaDB performs semantic search using embeddings.**

---

# 📚 What is ChromaDB?

ChromaDB is an **open-source Vector Database** designed specifically for AI applications.

Unlike traditional databases that search using exact values, ChromaDB searches using **vector similarity**.

Instead of comparing text directly, ChromaDB compares **embedding vectors**.

Example

```
User Query

↓

Embedding

↓

Vector Search

↓

Most Similar Documents
```

---

# 🤔 Why Do We Need ChromaDB?

In the previous chapter we manually calculated

- Dot Product
- Cosine Similarity

That approach works for a few documents.

Imagine comparing

```
10 Million Documents
```

using Cosine Similarity.

It would require comparing the query vector with every stored vector.

```
Query

↓

Document 1

↓

Document 2

↓

Document 3

↓

...

↓

Document 10,000,000
```

This is extremely slow.

A Vector Database solves this problem by using specialized indexing algorithms that perform similarity searches efficiently.

---

# 🔄 Complete Execution Flow

```
Application Starts
        │
        ▼
Load Environment Variables
        │
        ▼
Create OpenAI Client
        │
        ▼
Create ChromaDB Client
        │
        ▼
Create Embedding Function
        │
        ▼
Connect/Create Collection
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
Receive User Query
        │
        ▼
Generate Query Embedding
        │
        ▼
Similarity Search
        │
        ▼
Return Most Similar Documents
```

---

# 1️⃣ Importing Required Packages

```ts
import { OpenAI } from "openai";
import { configDotenv } from "dotenv";
import {
    ChromaClient,
    EmbeddingFunction
} from "chromadb";
```

## Purpose

Import all required libraries.

### OpenAI

Generates embeddings.

---

### dotenv

Loads environment variables.

---

### ChromaDB

Provides the Vector Database client.

---

### EmbeddingFunction

Interface used for creating a custom embedding provider.

---

# 2️⃣ Loading Environment Variables

```ts
configDotenv();
```

Loads

```
.env
```

into

```
process.env
```

Without this,

the OpenAI API key cannot be accessed.

---

# 3️⃣ Creating the OpenAI Client

```ts
const openai = new OpenAI(...)
```

Creates an authenticated OpenAI client.

Every embedding request goes through this object.

---

# 4️⃣ Creating a Custom Embedding Function

```ts
class OpenaiEmbedding implements EmbeddingFunction
```

This is one of the most important parts of this chapter.

Instead of manually generating embeddings,

we teach ChromaDB how to generate embeddings.

Think of it like this

```
ChromaDB

↓

Needs Embedding

↓

Calls

↓

generate()

↓

OpenAI

↓

Returns Vector
```

---

# 5️⃣ generate()

```ts
generate(texts:string[])
```

Receives multiple text documents.

Example

```
[
"Node.js",

"MongoDB",

"Redis"
]
```

↓

OpenAI

↓

```
[
Vector1,

Vector2,

Vector3
]
```

Each document receives its own embedding.

---

# 6️⃣ Creating Chroma Client

```ts
const chromaClient =
new ChromaClient(...)
```

Creates a connection with the ChromaDB server.

```
Node.js

↓

localhost:8000

↓

ChromaDB
```

This client performs all database operations.

---

# 7️⃣ Heartbeat

```ts
chromaClient.heartbeat()
```

Purpose

Checks whether the ChromaDB server is alive.

Think of it as

```
Application

↓

"Are you running?"

↓

ChromaDB

↓

"Yes."
```

Useful for health checks.

---

# 8️⃣ init()

```ts
init()
```

Creates (or retrieves) a collection.

Flow

```
Application

↓

Collection Exists?

↓

Yes

↓

Return Collection

OR

↓

Create Collection
```

This prevents duplicate collections.

---

# 9️⃣ Collection

```ts
my_test_collection
```

A Collection is similar to

SQL

↓

Table

MongoDB

↓

Collection

It stores

- Documents
- Embeddings
- Metadata
- IDs

---

# 🔟 Embedding Function Registration

```ts
embeddingFunction:
embedder
```

This tells ChromaDB

```
Whenever a document is inserted,

use this embedding function.
```

The developer no longer needs to manually create embeddings.

---

# 1️⃣1️⃣ addMessages()

```ts
addMessages(...)
```

Adds a document into ChromaDB.

Flow

```
Text

↓

Embedding Function

↓

Vector

↓

Collection

↓

Stored
```

Notice

You only provide

```ts
documents:[text]
```

The embedding is generated automatically.

---

# 1️⃣2️⃣ IDs

```ts
ids:[id]
```

Every document must have a unique identifier.

Example

```
1

2

3
```

IDs are used internally by ChromaDB.

---

# 1️⃣3️⃣ Querying Similar Documents

```ts
collection.query(...)
```

This performs semantic search.

Flow

```
Query

↓

Embedding Function

↓

Query Vector

↓

Vector Search

↓

Most Similar Documents
```

No manual cosine similarity calculation is required.

---

# 1️⃣4️⃣ queryTexts

```ts
queryTexts
```

Instead of sending vectors,

we send plain text.

Example

```
How do I bake cookies?
```

↓

Embedding Function

↓

Embedding Vector

↓

Similarity Search

↓

Results

---

# 1️⃣5️⃣ nResults

```ts
nResults
```

Controls how many matching documents are returned.

Example

```
5
```

↓

Top 5 Similar Documents

---

# 1️⃣6️⃣ run()

Coordinates the entire application.

Workflow

```
Create Collection

↓

Insert Documents

↓

Generate Embeddings

↓

Store Vectors

↓

User Query

↓

Semantic Search

↓

Display Results
```

---

# 1️⃣7️⃣ Adding Documents

```ts
await addMessages(...)
```

Each call inserts

- Document
- ID

The embedding is generated automatically.

---

# 1️⃣8️⃣ User Query

```
How do you bake cookies at home?
```

This sentence is converted into a vector.

The vector is then compared against all stored vectors.

---

# 1️⃣9️⃣ Search Results

Returned document

```
A delicious recipe for homemade chocolate chip cookies.
```

Notice

The words

```
bake
```

and

```
recipe
```

are not identical.

The similarity comes from meaning,

not keywords.

---

# 📊 Overall Workflow

```
Documents

↓

OpenAI Embedding Model

↓

Vectors

↓

ChromaDB

↓

Store Vectors

↓

User Query

↓

Embedding

↓

Similarity Search

↓

Matching Documents
```

---

# 📂 Internal Storage

Each stored document contains

```
ID

↓

Original Text

↓

Embedding

↓

Metadata (Optional)
```

---

# 🌍 Real-World Applications

This same workflow powers

- ChatGPT Retrieval
- AI Search Engines
- RAG Systems
- Enterprise Knowledge Bases
- AI Customer Support
- Recommendation Systems
- Semantic Search
- Similar Document Detection

---

# ⚠️ Current Limitations

This implementation is intended for learning.

Some improvements for production:

- Reuse the collection instead of calling `init()` for every operation.
- Batch insert multiple documents.
- Store metadata with documents.
- Add `try...catch` around database operations.
- Validate ChromaDB connectivity before inserting documents.
- Log query latency and failures.
- Avoid hardcoded collection names.

---

# 🏭 Production Architecture

```
Client

↓

Backend API

↓

Embedding Service

↓

OpenAI

↓

Vector Database

↓

Similarity Search

↓

LLM

↓

Final Answer
```

This is the architecture used by most Retrieval-Augmented Generation (RAG) systems.

---

# 📌 Key Takeaways

After completing this chapter, you should understand:

- Why Vector Databases exist.
- How ChromaDB stores embeddings.
- What Collections are.
- How custom embedding functions work.
- Why embeddings don't need to be generated manually when using an embedding function.
- How semantic search differs from keyword search.
- How ChromaDB performs similarity search.
- Why vector databases are the foundation of Retrieval-Augmented Generation (RAG), AI search engines, and modern AI assistants.s