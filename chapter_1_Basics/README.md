# Chapter 01 - Basic OpenAI Model

## Overview

This chapter demonstrates the simplest way to communicate with an OpenAI Large Language Model (LLM) using the official OpenAI TypeScript SDK.

It introduces the basic request-response lifecycle and serves as the foundation for all future GenAI applications.

---

# Learning Objectives

After completing this chapter, you will understand:

- How to install the OpenAI SDK
- How authentication works
- How to securely store API keys
- How to initialize an OpenAI client
- How to send prompts to a model
- How to receive AI-generated responses
- How the Chat Completions API works

---

# Project Structure

```
01-basic-model
│
├── src
│   └── index.ts
├── .env
├── package.json
└── tsconfig.json
```

---

# Installation

```bash
npm install openai dotenv
```

---

# Environment Variables

Create a `.env` file.

```env
OPEN_AI_API_KEY=your_api_key_here
```

Never commit your API key to Git.

---

# Code Flow

```
Load .env
      │
      ▼
Create OpenAI Client
      │
      ▼
Send User Prompt
      │
      ▼
OpenAI API
      │
      ▼
Generate Response
      │
      ▼
Print Output
```

---

# Explanation

## 1. Load Environment Variables

```ts
configDotenv();
```

Reads the `.env` file and loads its values into `process.env`.

---

## 2. Create Client

```ts
const openai = new OpenAI({...})
```

Creates an authenticated client used for all API requests.

---

## 3. Create Chat Completion

```ts
openai.chat.completions.create(...)
```

Sends the conversation to the model and waits until the model finishes generating a response.

---

## 4. Read the Response

```ts
response.choices[0].message.content
```

The generated text is stored inside the first choice returned by the model.

---

# Request Lifecycle

```
Application

↓

OpenAI SDK

↓

HTTPS Request

↓

OpenAI Server

↓

GPT Model

↓

Generated Response

↓

SDK

↓

Your Application
```

---

# Advantages

- Easy to understand
- Minimal code
- Great for beginners
- Official SDK
- TypeScript support
- Secure authentication

---

# Limitations

- Waits for the complete response
- No streaming
- No tool calling
- No structured output
- No conversation memory
- Higher latency for long responses

---

# Best Practices

- Store API keys in `.env`
- Use TypeScript
- Handle API errors
- Never expose API keys to the frontend
- Validate environment variables
- Choose the appropriate model for your use case

---

# Common Mistakes

❌ Hardcoding API keys

❌ Forgetting to load `.env`

❌ Using `any`

❌ Ignoring API errors

❌ Accessing `choices[0]` without checking

---

# Real-world Use Cases

- Chatbots
- AI assistants
- Content generation
- Email drafting
- Text summarization
- Translation
- Code generation

---

# Interview Questions

### What is the OpenAI SDK?

### Why use environment variables?

### What is an OpenAI client?

### What is a Chat Completion?

### What is a model?

### Why is `choices` an array?

### Why should API keys never be exposed?

---

# Summary

In this chapter you learned how to:

- Authenticate with OpenAI
- Initialize the SDK
- Send a prompt
- Receive a response
- Build your first AI application

This forms the foundation for every GenAI application you'll build in the upcoming chapters.