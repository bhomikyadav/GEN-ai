# 🔧 Chapter 03 - Function Calling

> Learn how Large Language Models (LLMs) interact with external functions to retrieve real-time information and perform actions beyond their built-in knowledge.

---

# 📖 Overview

Large Language Models are incredibly knowledgeable, but they have one important limitation:

> **They cannot access real-time information or execute code on their own.**

For example, if you ask:

```text
What is the current time in India?
```

the model cannot determine the current time by itself.

Instead, it can **request** that your application execute a function capable of retrieving the current time.

This process is called **Function Calling** (also known as **Tool Calling**).

In this chapter, we'll build a simple application where the model requests the execution of a JavaScript function to obtain the current time in India.

---

# 🎯 Learning Objectives

After completing this chapter, you will understand:

- What Function Calling is.
- Why LLMs need external tools.
- How to define tools using the OpenAI SDK.
- How the model decides to invoke a function.
- How to execute a requested function.
- How to send the function result back to the model.
- The complete Function Calling lifecycle.

---

# 🧠 Prerequisites

Before this chapter you should understand:

- Chat Completions API
- Conversation Context
- Message Roles
- Async/Await
- TypeScript Functions

---

# 🤔 Why Do We Need Function Calling?

Imagine asking:

```text
What's the current time?
```

The model cannot access your computer clock.

Similarly,

- Current weather
- Stock prices
- Database queries
- User information
- File system access

are all unavailable to the model unless your application provides access.

Instead of guessing,

the model requests that your application execute an external function.

---

# 🏗️ Architecture

```
                User
                  │
                  ▼
        Chat Completion Request
                  │
                  ▼
          OpenAI Language Model
                  │
      Needs External Information?
          │                 │
         No                Yes
          │                 │
          ▼                 ▼
    Generate Reply      Return Tool Call
                              │
                              ▼
                    Execute JavaScript Function
                              │
                              ▼
                     Return Tool Result
                              │
                              ▼
                   Second Chat Completion Request
                              │
                              ▼
                    Final AI Response
```

---

# ⚙️ Project Structure

```
03-function-calling/
│
├── README.md
├── package.json
├── tsconfig.json
├── .env
└── src
    └── index.ts
```

---

# 📦 Installation

```bash
npm install openai dotenv
```

---

# 🔐 Environment Variables

```env
OPEN_AI_API_KEY=your_api_key_here
```

---

# 🧠 What is a Tool?

A tool is simply a function that your application exposes to the AI model.

Example:

```ts
function getTimeOfIndia() {
    ...
}
```

The model **does not execute this function**.

Instead, it requests:

> "Please execute `getTimeOfIndia()`."

Your application is responsible for:

1. Detecting the request.
2. Executing the function.
3. Returning the result.

---

# 🔄 Function Calling Flow

```
User

↓

OpenAI

↓

Tool Requested

↓

JavaScript Function

↓

Tool Result

↓

OpenAI

↓

Final Response
```

---

# 📝 Execution Flow

### Step 1

Initialize the OpenAI client.

↓

### Step 2

Create the conversation context.

↓

### Step 3

Register available tools.

↓

### Step 4

Send the request.

↓

### Step 5

The model decides whether a tool is required.

↓

### Step 6

If a tool is requested,

execute the JavaScript function.

↓

### Step 7

Append the tool result to the conversation.

↓

### Step 8

Send the updated conversation back to OpenAI.

↓

### Step 9

Receive the final response.

---

# 🧩 Understanding Tool Registration

Every tool must include:

- Name
- Description
- Parameters

Example:

```ts
{
    type: "function",
    function: {
        name: "getTimeOfIndia",
        description: "...",
        parameters: {...}
    }
}
```

The description is extremely important because the model uses it to decide **when** the tool should be called.

---

# 🔁 Why Two API Calls?

This is one of the most common questions.

The first request allows the model to decide:

```
Should I answer myself?

OR

Should I call a tool?
```

If a tool is required,

the model returns:

```
tool_calls
```

Your application executes the function.

A second request is then sent containing the tool result.

Only after receiving the function output can the model generate the final answer.

---

# 💬 Example Conversation

### User

```text
What is the current time in India?
```

↓

### Model

```
tool_call

getTimeOfIndia()
```

↓

### JavaScript

```
10:45:21 PM
```

↓

### Model

```
The current time in India is 10:45:21 PM.
```

---

# ✅ Advantages

- Access real-time information.
- Execute business logic.
- Connect to databases.
- Call external APIs.
- Build intelligent AI assistants.
- Integrate enterprise systems.

---

# ❌ Limitations

- The model never executes functions directly.
- Your application must execute every tool.
- Requires additional API requests.
- Increases implementation complexity.
- Poor tool descriptions may prevent invocation.

---

# 🏭 Production Considerations

Production applications should:

- Validate tool arguments.
- Restrict tool permissions.
- Log tool usage.
- Handle execution failures.
- Retry transient errors.
- Authenticate users before executing sensitive operations.
- Monitor tool performance.
- Limit execution time.

---

# 💡 Best Practices

- Give tools descriptive names.
- Write clear descriptions explaining when the tool should be used.
- Keep functions focused on a single responsibility.
- Validate all inputs.
- Return structured data when appropriate.
- Handle exceptions gracefully.
- Avoid exposing unnecessary tools.

---

# ⚠️ Common Mistakes

❌ Expecting the model to execute JavaScript directly.

❌ Forgetting the second API request.

❌ Not appending the assistant tool-call message to the conversation.

❌ Using vague tool descriptions.

❌ Returning malformed tool responses.

❌ Assuming every user request requires a tool.

---

# 📚 Real-World Applications

Function Calling powers:

- Weather Assistants
- Calendar Scheduling
- Travel Booking
- Banking Assistants
- Customer Support
- CRM Systems
- Database Queries
- Order Tracking
- Email Automation
- Smart Home Control

---

# ❓ Interview Questions

## Beginner

1. What is Function Calling?
2. Why can't an LLM execute JavaScript directly?
3. What is a tool?
4. Why do tools require descriptions?
5. What is `tool_choice`?

---

## Intermediate

1. Why are two API calls required?
2. How does the model decide whether to call a tool?
3. What happens if the function throws an error?
4. Why should tool parameters be validated?
5. How would you expose multiple tools?

---

## Advanced

1. How would you secure Function Calling in production?
2. How would you prevent unauthorized tool execution?
3. How would you build a generic Tool Registry?
4. How would you support dozens of tools efficiently?
5. How would you monitor tool usage and failures?

---

# 📖 Summary

In this chapter, you learned how to extend a language model with external capabilities using Function Calling.

You explored:

- Why LLMs need tools.
- How to register functions.
- How the model requests function execution.
- Why two API calls are required.
- How to execute a function and return its result.
- Best practices for building production-ready AI tools.

Function Calling is the foundation for more advanced topics such as AI Agents, Retrieval-Augmented Generation (RAG), workflow automation, and integrations with databases and external APIs.

---

# ⏭️ What's Next?

In the next chapter, we'll explore **Streaming Responses**, where the model sends tokens incrementally to create faster and more interactive user experiences similar to ChatGPT.