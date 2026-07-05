To set up a clean, modern TypeScript environment, you need a few core tools: Node.js, the TypeScript compiler (`tsc`), and a configuration file (`tsconfig.json`).

Here is the quickest way to get a project up and running from scratch.

## Step-by-Step Setup

1. **Initialize your project:** 1 min.
   Open your terminal in an empty folder and initialize a standard Node.js project to create your `package.json` file:

```bash
npm init -y

```

2. **Install TypeScript:** 1 min.
   Install TypeScript and `tsx` (a great tool for executing TypeScript files directly without manual compiling) as development dependencies:

```bash
npm install -D typescript tsx @types/node

```

3. **Generate the configuration file:** 30 seconds.
   Create a default `tsconfig.json` file, which tells the compiler how to handle your code:

```bash
npx tsc --init

```

4. **Configure tsconfig.json:** 2 min.
   Open the newly created `tsconfig.json` and ensure these core settings are active. This sets up a clean build pipeline where your source code lives in `src/` and compiles to `dist/`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

5. **Create your first file:** 30 seconds.
   Create a `src` directory and add an `index.ts` file inside it:

```bash
mkdir src && touch src/index.ts

```

Populate `src/index.ts` with a simple test:

```typescript
const message: string = "TypeScript is running!";
console.log(message);
```

---

## Running and Building Your Code

To make your life easier, add these shortcuts to the `"scripts"` object inside your `package.json` file:

```json
"scripts": {
  "dev": "tsx watch src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}

```

- **`npm run dev`**: Runs your code instantly and watches for changes. Perfect for local development.
- **`npm run build`**: Compiles your TypeScript files into production-ready JavaScript inside the `dist/` folder.
- **`npm run start`**: Runs the compiled JavaScript code.
