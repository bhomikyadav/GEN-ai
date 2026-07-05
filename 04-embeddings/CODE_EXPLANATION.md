# 📄 CODE_EXPLANATION.md

> **Chapter 04 - Embeddings & Semantic Similarity**

This document explains every part of the code in detail. You'll learn not only **what** each function does, but also **why** it's required and **how** embeddings and similarity search work internally.

---

# 📚 What Are Embeddings?

An embedding is a numerical representation of text.

Instead of understanding words directly, AI models convert text into vectors (arrays of numbers).

Example:

```
"I love programming"
```

↓

```
[0.182, -0.491, 0.918, ...]
```

These vectors capture the **semantic meaning** of the text.

If two texts have similar meanings, their vectors will be close together.

---

# 🤔 Why Do We Need Embeddings?

Traditional search works using keywords.

Example:

```
Document 1
"I love dogs."
```

```
Document 2
"I like puppies."
```

A keyword search may fail because the words are different.

An embedding model understands that:

```
dogs ≈ puppies
```

and generates similar vectors.

This allows semantic search instead of keyword matching.

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
Read sample.json
        │
        ▼
Extract Content
        │
        ▼
Generate Embeddings
        │
        ▼
Attach Embeddings
        │
        ▼
Compare Vectors
        │
        ▼
Calculate Similarity
        │
        ▼
Sort Results
        │
        ▼
Save JSON Files
        │
        ▼
Program Ends
```

---

# 1. Importing Required Modules

```ts
import { OpenAI } from "openai";
import { configDotenv } from "dotenv";
import { readFileSync } from "fs";
import { writeFile } from "fs/promises";
import { join } from "path";
```

## Purpose

These modules provide the functionality required by the application.

### OpenAI

Used to generate embeddings.

---

### dotenv

Loads environment variables from the `.env` file.

---

### fs

Reads local JSON files.

---

### fs/promises

Writes JSON files asynchronously.

---

### path

Creates operating-system-independent file paths.

---

# 2. Loading Environment Variables

```ts
configDotenv();
```

Reads the `.env` file.

Example:

```env
OPEN_AI_API_KEY=sk-xxxxxxxx
```

Without this call,

```ts
process.env.OPEN_AI_API_KEY;
```

would be `undefined`.

---

# 3. Creating the OpenAI Client

```ts
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});
```

Creates an authenticated client for communicating with the OpenAI API.

Every embedding request passes through this client.

---

# 4. Defining the User Type

```ts
type UserT = {
  id: string;
  category: string;
  title: string;
  content: string;
  embedded?: number[];
};
```

Represents one document (or user) in the dataset.

Example:

```json
{
  "id": "1",
  "title": "Node.js",
  "content": "Node.js is a JavaScript runtime."
}
```

Later, an embedding is added:

```json
{
    "embedded": [...]
}
```

---

# 5. Dot Product

```ts
const dotProduct = (...)
```

## Purpose

Calculates the dot product of two vectors.

Formula:

```
A•B

=

A₁B₁

+

A₂B₂

+

A₃B₃

...

+

AₙBₙ
```

Example:

```
Vector A

[2,3]
```

```
Vector B

[4,5]
```

Result

```
2×4 + 3×5

=

23
```

The dot product is also used when calculating cosine similarity.

---

# 6. Cosine Similarity

```ts
const cosineSimilarity = (...)
```

## Purpose

Measures how similar two vectors are.

Formula

```
          A • B
-------------------------
|A| × |B|
```

Unlike the dot product,

Cosine Similarity considers the angle between vectors.

Result range

```
1

↓

Exactly Similar
```

```
0

↓

No Relationship
```

```
-1

↓

Completely Opposite
```

Embeddings usually produce values between **0** and **1**.

---

# 7. similarity()

```ts
async function similarity(...)
```

This function compares one target user against every other user.

Flow

```
Target User

↓

Compare

↓

Calculate Dot Product

↓

Calculate Cosine Similarity

↓

Sort

↓

Return Ranked Results
```

---

## Filtering

```ts
filter(...)
```

Removes the current user.

A document should never be compared with itself.

---

## Mapping

```ts
map(...)
```

Transforms every user into

```ts
{
  (name, dotProduct, cosine);
}
```

---

## Sorting

```ts
sort(...)
```

Orders users by similarity.

Highest cosine value

↓

Most similar document.

---

# 8. Reading Sample Data

```ts
getSampleData();
```

Reads

```
sample.json
```

This file acts as a small dataset.

Example

```
[
User 1

User 2

User 3
]
```

---

# 9. Saving JSON Files

```ts
saveDataToJSONFile(...)
```

Stores generated data locally.

Files created

```
embedded.json
```

↓

Raw API response.

---

```
User_data_with_embedded.json
```

↓

Users + embeddings.

---

```
finalOutput.json
```

↓

Similarity ranking.

---

# 10. Generating Embeddings

```ts
getEmbeddingFromAI(...)
```

This function sends all document content to

```
text-embedding-3-small
```

Example

```
Content

↓

Embedding API

↓

Vectors
```

Because multiple strings are passed,

the API generates one embedding for each document.

---

# 11. run()

This is the application's entry point.

It coordinates the entire workflow.

---

## Step 1

Read sample data.

```
sample.json

↓

Users
```

---

## Step 2

Extract only the content field.

```
Users

↓

Content[]
```

The embedding model only needs plain text.

---

## Step 3

Generate embeddings.

```
Content

↓

OpenAI

↓

Embedding Vectors
```

---

## Step 4

Attach embeddings.

Each user now becomes

```json
{
    "id": "...",
    "content": "...",
    "embedded": [...]
}
```

---

## Step 5

Save users with embeddings.

```
User_data_with_embedded.json
```

---

## Step 6

Find similar users.

```
Target User

↓

Compare

↓

Rank

↓

Output
```

---

## Step 7

Print the results.

Example

```text
User 2

Cosine Similarity

0.94
```

---

# 📊 Overall Workflow

```
sample.json

↓

Read Documents

↓

Extract Content

↓

Embedding Model

↓

Vectors

↓

Store Embeddings

↓

Similarity Search

↓

Rank Results

↓

Save Output
```

---

# 📂 Output Files

## embedded.json

Contains the complete response from the Embeddings API.

Useful for debugging and understanding the API response format.

---

## User_data_with_embedded.json

Contains the original user data together with generated embeddings.

Example:

```json
{
    "id": "1",
    "content": "...",
    "embedded": [...]
}
```

---

## finalOutput.json

Contains similarity scores sorted from most similar to least similar.

---

# 🌍 Real-World Applications

The same workflow is used in:

- Semantic Search
- AI Chatbots
- Retrieval-Augmented Generation (RAG)
- Recommendation Systems
- Enterprise Knowledge Bases
- Product Search
- Similar Document Detection
- Duplicate Content Detection

---

# ⚠️ Current Limitations

This implementation is intended for learning.

Some limitations include:

- Embeddings are stored in JSON files instead of a vector database.
- Every run regenerates embeddings.
- No caching mechanism.
- No error handling.
- No batching for very large datasets.
- No pagination or indexing.

---

# 🏭 Production Improvements

A production system would:

- Store embeddings in a vector database such as Pinecone or Qdrant.
- Cache embeddings to avoid unnecessary API calls.
- Regenerate embeddings only when content changes.
- Handle API failures using `try...catch`.
- Validate embedding dimensions before comparison.
- Batch requests for large datasets.
- Monitor API usage and costs.

---

# 📌 Key Takeaways

After completing this chapter, you should understand:

- What embeddings are.
- Why semantic search is better than keyword search for many use cases.
- How to generate embeddings using OpenAI.
- How vectors are compared using Dot Product and Cosine Similarity.
- How similarity ranking works.
- Why embeddings are the foundation of modern AI applications such as RAG, recommendation systems, and vector search.
