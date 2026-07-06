# 📄 CODE_EXPLANATION.md

> **Chapter 06 - LangChain Basics**

This document explains every part of the code in detail. You'll learn **how LangChain works internally**, why it exists, and how it simplifies working with Large Language Models (LLMs).

---

# 📚 What is LangChain?

LangChain is a framework that helps developers build applications powered by Large Language Models (LLMs).

Instead of writing low-level API calls yourself, LangChain provides reusable abstractions such as:

- Chat Models
- Prompt Templates
- Output Parsers
- Memory
- Chains
- Agents
- Tools
- Retrievers

Think of it as a toolkit that sits between your application and the LLM.

```
Application
      │
      ▼
  LangChain
      │
      ▼
 OpenAI API
      │
      ▼
 Large Language Model
```

---

# 🤔 Why Use LangChain?

Without LangChain, developers often:

- Build prompts using string concatenation.
- Repeat the same API call logic.
- Manage streaming manually.
- Handle batching themselves.
- Recreate reusable workflows.

LangChain standardizes these patterns and provides a consistent API.

---

# 🔄 Complete Execution Flow

```
Application Starts
        │
        ▼
Load Environment Variables
        │
        ▼
Create ChatOpenAI Model
        │
        ▼
invoke()
        │
        ▼
Receive AI Response
        │
        ▼
batch()
        │
        ▼
Receive Multiple Responses
        │
        ▼
stream()
        │
        ▼
Receive Streaming Tokens
        │
        ▼
Create Prompt Template
        │
        ▼
Inject Variables
        │
        ▼
Convert Template to Chat Messages
        │
        ▼
Send Prompt to Model
        │
        ▼
Display Final Response
```

---

# 1️⃣ Importing Required Packages

```ts
import { configDotenv } from "dotenv";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
```

## Purpose

These libraries provide the core functionality used in this chapter.

### dotenv

Loads environment variables.

---

### ChatOpenAI

Represents an OpenAI chat model within LangChain.

---

### ChatPromptTemplate

Allows prompts to be defined as reusable templates with placeholders.

---

# 2️⃣ Loading Environment Variables

```ts
configDotenv();
```

Reads the `.env` file and loads variables into `process.env`.

Example:

```env
OPEN_AI_API_KEY=sk-xxxxxxxx
```

Without this call, the API key would be unavailable.

---

# 3️⃣ Creating the Chat Model

```ts
const model = new ChatOpenAI(...)
```

This creates a reusable chat model.

Instead of calling the OpenAI SDK directly, all interactions now go through LangChain.

```
Application

↓

ChatOpenAI

↓

OpenAI

↓

LLM
```

---

# 4️⃣ Model Configuration

```ts
model: "gpt-4o-mini";
```

Specifies which OpenAI model should be used.

---

```ts
apiKey;
```

Authenticates the request.

---

# 5️⃣ invoke()

```ts
await model.invoke(...)
```

`invoke()` sends a **single prompt** to the model.

Example

Input

```
What is the capital of India?
```

↓

Output

```
New Delhi
```

Internally, LangChain prepares the request, sends it to OpenAI, and wraps the response in an `AIMessage`.

---

# 6️⃣ AIMessage

The response returned by `invoke()` is **not** a plain string.

It is an `AIMessage` object.

Example

```text
AIMessage

↓

content

↓

"The capital of India is New Delhi."
```

This object can also contain metadata such as token usage and model information.

---

# 7️⃣ batch()

```ts
await model.batch([...])
```

Processes multiple prompts in a single method call.

Example

Input

```
Prompt 1

Prompt 2
```

↓

Output

```
Response 1

Response 2
```

This is useful for:

- Translation
- Classification
- Summarization
- Bulk processing

---

# 8️⃣ Streaming

```ts
await model.stream(...)
```

Normally, the model waits until the complete response is generated.

Streaming returns the response incrementally.

Example

Instead of

```
Hello, my name is ChatGPT.
```

You receive

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

This is how applications like ChatGPT display text while it is being generated.

---

# 9️⃣ Asynchronous Iteration

```ts
for await (const chunk of streamRes)
```

A streaming response is an **async iterable**.

Each iteration provides a small piece of the generated response.

Example

```
Chunk 1

↓

Chunk 2

↓

Chunk 3
```

Until the full response has been received.

---

# 🔟 Prompt Templates

```ts
ChatPromptTemplate.fromMessages(...)
```

Creates a reusable chat prompt.

Instead of manually constructing prompts each time, you define a template once.

Template

```
Translate below text to {language}
```

User

```
{text}
```

The placeholders are replaced later with real values.

---

# 1️⃣1️⃣ Message Roles

The prompt template contains two message roles:

### System

```
Translate below text to {language}
```

This sets the behavior or instruction.

---

### User

```
{text}
```

This contains the actual input provided by the user.

---

# 1️⃣2️⃣ invoke() on Prompt Templates

```ts
await prompt.invoke(...)
```

This does **not** call the LLM.

Instead, it fills the placeholders in the template.

Input

```
language = Hindi

text = hi
```

↓

Generated Prompt

System

```
Translate below text to Hindi
```

User

```
hi
```

---

# 1️⃣3️⃣ toChatMessages()

```ts
res.toChatMessages();
```

Converts the generated prompt into a format that the chat model understands.

Output

```
[
System Message,

User Message
]
```

These messages are then sent to the model.

---

# 1️⃣4️⃣ Sending the Prompt

```ts
await model.invoke(promptValue);
```

The generated chat messages are passed to the model.

Flow

```
Prompt Template

↓

Variables

↓

Chat Messages

↓

Chat Model

↓

LLM

↓

Response
```

---

# 1️⃣5️⃣ run()

This function demonstrates the three primary ways to interact with a chat model:

1. Single invocation
2. Batch invocation
3. Streaming invocation

It serves as an introduction to the Chat Model API.

---

# 1️⃣6️⃣ promptTest()

This function demonstrates how Prompt Templates work.

Flow

```
Template

↓

Variables

↓

Resolved Prompt

↓

Chat Messages

↓

LLM

↓

Response
```

Separating prompt creation from model execution makes prompts reusable and easier to maintain.

---

# 📊 Overall Workflow

```
User Input

↓

Prompt Template

↓

Variables

↓

Chat Messages

↓

ChatOpenAI

↓

OpenAI

↓

LLM

↓

AI Response
```

---

# 🌍 Real-World Applications

These LangChain features are commonly used in:

- AI Chatbots
- Translation Systems
- Document Summarization
- Customer Support
- Code Generation
- Workflow Automation
- Retrieval-Augmented Generation (RAG)
- AI Agents

---

# ⚠️ Current Limitations

This implementation is intended for learning.

Possible production improvements include:

- Add `try...catch` around model calls.
- Await `run()` before `promptTest()` to avoid interleaved console output.
- Extract prompt templates into separate files.
- Reuse prompt templates across the application.
- Validate template variables before invocation.
- Log token usage and response times.

---

# 🏭 Production Architecture

```
Client

↓

Backend

↓

Prompt Template

↓

LangChain

↓

Chat Model

↓

OpenAI

↓

LLM

↓

Streaming Response

↓

Client
```

This architecture is commonly used in production AI systems.

---

# 📌 Key Takeaways

After completing this chapter, you should understand:

- What LangChain is and why it exists.
- How `ChatOpenAI` abstracts LLM interactions.
- The difference between `invoke()`, `batch()`, and `stream()`.
- Why Prompt Templates are preferred over hardcoded strings.
- How prompt variables make templates reusable.
- How LangChain converts prompt templates into chat messages.
- Why LangChain provides a strong foundation for building Retrieval-Augmented Generation (RAG), Chains, Memory, Agents, and LangGraph applications.
