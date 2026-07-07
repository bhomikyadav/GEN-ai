# GenAI with Node.js and TypeScript

This repository is a hands-on learning path for building Generative AI applications with Node.js and TypeScript using the OpenAI SDK.

It is organized as a series of small, practical chapters that introduce core GenAI concepts step by step:

- Basic OpenAI API usage
- Chat conversation memory
- Function and tool calling
- Embeddings and semantic similarity

---

## What You Will Learn

By working through this project, you will learn how to:

- Set up a TypeScript + Node.js project
- Use the OpenAI SDK in real applications
- Store and manage conversation context
- Use tool calling to let models interact with local functions
- Generate text embeddings and compare them semantically
- Build a foundation for more advanced AI systems such as RAG and vector search

---

## Repository Structure

- [00-chapter_0](00-chapter_0)  
  Introductory notes on GenAI terminology and TypeScript setup.

- [01-basic-model](01-basic-model)  
  A simple example that sends a prompt to an OpenAI model and prints the response.

- [02-chat-conversation-memory](02-chat-conversation-memory)  
  A terminal chatbot that keeps chat history so the model can respond with context.

- [03-tool-calling](03-tool-calling)  
  Demonstrates function calling or tool calling so the model can request local logic execution.

- [04-embeddings](04-embeddings)  
  Generates embeddings from text and compares documents using vector similarity.

---

## Prerequisites

Before running the examples, make sure you have:

- Node.js installed
- npm installed
- An OpenAI API key

You will also need to create a .env file in each chapter folder with:

```env
OPEN_AI_API_KEY=your_api_key_here
```

---

## Installation

Each chapter is self-contained. To get started, navigate into a chapter folder and install dependencies:

```bash
cd 01-basic-model
npm install
```

You can repeat the same process for the other chapters.

---

## Running the Examples

Most chapters use the following command:

```bash
npm run dev
```

Example:

```bash
cd 02-chat-conversation-memory
npm install
npm run dev
```

---

## Chapter Overview

### 00-chapter_0

This section covers foundational concepts:

- AI, ML, deep learning, and Generative AI
- LLM basics
- TypeScript project setup

### 01-basic-model

This chapter introduces the basic workflow:

1. Load environment variables
2. Create an OpenAI client
3. Send a prompt to the model
4. Print the generated response

### 02-chat-conversation-memory

This chapter shows how to build a chat experience that remembers previous messages. The conversation history is sent back to the model on each turn so the assistant can stay context-aware.

### 03-tool-calling

This chapter teaches how an LLM can ask your application to run a function. This is useful for things like:

- Getting the current time
- Calling an API
- Querying a database
- Executing business logic

### 04-embeddings

This chapter focuses on embeddings:

- Convert text into vectors
- Store embeddings
- Compare documents using dot product and cosine similarity
- Perform semantic matching beyond simple keyword search

---

## Recommended Learning Order

1. Start with [00-chapter_0](00-chapter_0)
2. Move to [01-basic-model](01-basic-model)
3. Continue with [02-chat-conversation-memory](02-chat-conversation-memory)
4. Learn [03-tool-calling](03-tool-calling)
5. Finish with [04-embeddings](04-embeddings)

---

## Notes

- Keep your API keys private and never commit them to version control.
- Each chapter is designed for learning and experimentation.
- The examples use the official OpenAI SDK and TypeScript for clarity and simplicity.

---

## Summary

This repository provides a practical introduction to modern Generative AI development using Node.js and TypeScript. It starts with the basics and gradually moves toward more advanced concepts like memory, tools, and embeddings.

==END==
