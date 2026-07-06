# 🚀 Chapter 06 - LangChain Basics

> Learn the fundamentals of **LangChain**, one of the most popular frameworks for building Large Language Model (LLM) applications. This chapter introduces Chat Models, Prompt Templates, Batch Processing, and Streaming Responses.

---

# 📖 Overview

So far, we've interacted with OpenAI models directly using the OpenAI SDK.

While this works well for simple applications, production AI systems often require:

- Reusable prompts
- Multiple LLM providers
- Streaming responses
- Batch processing
- Tool calling
- Memory
- Retrieval (RAG)
- Agents

Instead of implementing these features manually, **LangChain** provides a standardized framework.

In this chapter, you'll learn the core building blocks of LangChain and how they simplify AI application development.

---

# 🎯 Learning Objectives

After completing this chapter, you'll understand:

- What LangChain is
- Why LangChain exists
- How Chat Models work
- How Prompt Templates work
- How to invoke an LLM
- How Batch Processing works
- How Streaming works
- How Prompt Variables work

---

# 🧠 Prerequisites

Before starting this chapter, you should understand:

- TypeScript
- Async/Await
- OpenAI SDK
- Chat Completions API

Recommended previous chapters:

- ✅ Chapter 01 - Basic Model
- ✅ Chapter 02 - Chat Conversation Memory
- ✅ Chapter 03 - Function Calling
- ✅ Chapter 04 - Embeddings
- ✅ Chapter 05 - Vector Database with ChromaDB

---

# 🤔 What is LangChain?

LangChain is an open-source framework for building applications powered by Large Language Models (LLMs).

Instead of interacting directly with OpenAI, your application communicates through LangChain.

```
Application
      │
      ▼
 LangChain
      │
      ▼
 OpenAI
      │
      ▼
 Language Model
```

LangChain provides a consistent API for working with multiple LLM providers.

---

# ❓ Why Do We Need LangChain?

Without LangChain:

```
Application

↓

OpenAI SDK

↓

Manual Prompt Management

↓

Manual Streaming

↓

Manual Tool Calling

↓

Manual Chains
```

With LangChain:

```
Application

↓

LangChain

↓

Prompt Templates

↓

Streaming

↓

Tools

↓

Memory

↓

RAG

↓

Agents
```

LangChain reduces boilerplate and makes complex AI applications easier to build.

---

# 🏗️ Architecture

```
                 User Input
                      │
                      ▼
              ChatPromptTemplate
                      │
                      ▼
                ChatOpenAI Model
                      │
                      ▼
             Large Language Model
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
      invoke()     batch()    stream()
```

---

# 📂 Project Structure

```
06-langchain-basics/
│
├── README.md
├── CODE_EXPLANATION.md
├── src/
│   └── index.ts
└── images/
```

---

# ⚙️ Technologies Used

- TypeScript
- Node.js
- LangChain
- OpenAI
- dotenv

---

# 📦 Installation

```bash
npm install @langchain/openai
npm install @langchain/core
npm install dotenv
```

---

# 🔐 Environment Variables

Create a `.env` file.

```env
OPEN_AI_API_KEY=your_api_key_here
```

---

# 📚 Core Concepts

---

## 1️⃣ Chat Models

A Chat Model represents a Large Language Model.

Example:

```ts
const model = new ChatOpenAI({
  model: "gpt-4o-mini",
});
```

The model object is responsible for communicating with OpenAI.

---

## 2️⃣ invoke()

`invoke()` sends a single request to the model.

```
Question

↓

LLM

↓

Answer
```

Example:

```ts
await model.invoke("What is the capital of India?");
```

---

## 3️⃣ batch()

Instead of making multiple API calls manually,

LangChain allows multiple prompts to be processed together.

```
Prompt 1

Prompt 2

Prompt 3

↓

Batch

↓

LLM

↓

Multiple Responses
```

Example:

```ts
await model.batch(["Hello", "What is AI?"]);
```

---

## 4️⃣ stream()

Normally,

the model waits until the entire response is generated.

Streaming returns the response token-by-token.

```
Hello

↓

my

↓

name

↓

is

↓

ChatGPT
```

This creates a real-time experience similar to ChatGPT.

---

## 5️⃣ Prompt Templates

Instead of hardcoding prompts,

LangChain allows reusable templates.

Template

```
Translate below text to {language}
```

Variables

```
language = Hindi

text = Hello
```

Final Prompt

```
Translate below text to Hindi

Hello
```

---

## 6️⃣ Prompt Variables

Variables make prompts reusable.

Instead of writing hundreds of prompts,

one template can support multiple languages.

Example:

```
Language

↓

English

↓

Hindi

↓

Spanish

↓

French
```

---

# 🔄 Execution Flow

```
Application Starts
        │
        ▼
Create ChatOpenAI Model
        │
        ▼
invoke()
        │
        ▼
batch()
        │
        ▼
stream()
        │
        ▼
Create Prompt Template
        │
        ▼
Inject Variables
        │
        ▼
Generate Prompt
        │
        ▼
Send to Model
        │
        ▼
Display Response
```

---

# 💻 What This Project Does

This project demonstrates:

- Creating a LangChain Chat Model.
- Sending a single request.
- Sending multiple requests in batch.
- Receiving streaming responses.
- Creating reusable prompt templates.
- Injecting dynamic variables into prompts.

---

# 📈 Example

### invoke()

Input

```
What is the capital of India?
```

↓

Output

```
New Delhi
```

---

### batch()

Input

```
Hello

What is the height of Mount Everest?
```

↓

Output

```
Hello!

8,848.86 meters
```

---

### stream()

Output

```
The

capital

of

India

is

New Delhi.
```

Displayed token-by-token.

---

### Prompt Template

Template

```
Translate below text to {language}
```

Variables

```
language = Hindi

text = Hi
```

Generated Prompt

```
Translate below text to Hindi

Hi
```

---

# ✅ Advantages

- Clean API
- Reusable prompts
- Provider abstraction
- Built-in streaming
- Batch processing
- Excellent TypeScript support
- Foundation for RAG and Agents

---

# ❌ Limitations

- Adds another abstraction layer
- Learning curve for beginners
- Not always necessary for very small projects
- Some advanced features require understanding LangChain internals

---

# 🏭 Production Considerations

In production:

- Reuse Chat Model instances.
- Store prompts separately.
- Validate prompt variables.
- Add retry logic.
- Handle API failures.
- Log token usage.
- Monitor response latency.
- Use streaming for long responses.

---

# 💡 Best Practices

- Create one Chat Model instance.
- Reuse Prompt Templates.
- Prefer Prompt Templates over string concatenation.
- Keep prompts modular.
- Wrap API calls with `try...catch`.
- Use environment variables for API keys.

---

# ⚠️ Common Mistakes

❌ Creating a new Chat Model for every request.

❌ Hardcoding prompts.

❌ Ignoring streaming.

❌ Mixing prompt construction with business logic.

❌ Forgetting to validate prompt variables.

---

# 🌍 Real-World Applications

LangChain is widely used for:

- AI Chatbots
- RAG Applications
- AI Agents
- Workflow Automation
- Customer Support
- Code Assistants
- Document Analysis
- Enterprise AI Platforms

---

# ❓ Interview Questions

## Beginner

1. What is LangChain?
2. Why use LangChain instead of the OpenAI SDK?
3. What is `ChatOpenAI`?
4. What does `invoke()` do?
5. What is a Prompt Template?

---

## Intermediate

1. Explain `batch()`.
2. Explain `stream()`.
3. Why use Prompt Templates?
4. What are Prompt Variables?
5. How does LangChain support multiple LLM providers?

---

## Advanced

1. When would you choose the OpenAI SDK over LangChain?
2. How would you organize prompts in a large project?
3. How does LangChain simplify RAG pipelines?
4. How would you optimize batch requests?
5. How would you implement streaming in a web application?

---

# 📖 Summary

In this chapter, you learned the core building blocks of LangChain.

You explored:

- Chat Models
- invoke()
- batch()
- stream()
- Prompt Templates
- Prompt Variables

These features form the foundation of nearly every LangChain application and prepare you for more advanced topics such as Chains, Retrieval-Augmented Generation (RAG), Memory, Agents, and LangGraph.

---

# ⏭️ What's Next?

In the next chapter, we'll build a **Retrieval-Augmented Generation (RAG)** application using **LangChain + ChromaDB + OpenAI**, where the model answers questions using your own documents instead of relying solely on its pre-trained knowledge.
