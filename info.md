# Nomiko: AI Legal Assistant Documentation

## 1. Overview

Nomiko is an AI-powered legal assistant designed to simplify the analysis of legal documents. Users can upload documents (PDF, DOCX, images) and receive AI-driven insights. The application is built to be intuitive, providing powerful analysis tools in a clean and accessible interface.

## 2. Core Features

- **Document Upload & Processing**: Users can upload documents (PDF, DOCX, PNG, JPG) or paste text directly. The system uses AI to extract text content.
- **Clause-by-Clause Summary**: Generates plain English summaries for each legal clause identified in the document.
- **Glossary Generation**: Automatically identifies legal terms and provides simple, AI-generated definitions with a text-to-speech option.
- **Fairness Benchmarking**: Compares document clauses against common Indian legal practices and flags any terms that are unusual or potentially unfair.
- **Contradiction Detection**: Scans the document to find and highlight clauses that contradict each other.
- **Chat Assistant**: A conversational AI interface to ask specific questions about the document's content.
- **Persistent Document History**: Recently analyzed documents are saved to the browser's local storage for easy access.

## 3. Tech Stack

- **Framework**: Next.js (with App Router)
- **Generative AI**: Google's Gemini models via Genkit
- **UI Components**: ShadCN UI
- **Styling**: Tailwind CSS
- **State Management**: React Hooks & Context API

## 4. Folder Structure

Here is a breakdown of the key directories and their purposes:

```
/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── layout.tsx       # Layout for the main dashboard view
│   │   │   └── page.tsx         # Main page for document analysis
│   │   ├── globals.css        # Global styles and Tailwind CSS setup
│   │   ├── layout.tsx         # Root layout for the entire application
│   │   └── page.tsx           # The initial upload/landing page
│   │
│   ├── ai/
│   │   ├── flows/             # Contains all Genkit AI flows
│   │   │   ├── chat.ts
│   │   │   ├── clause-by-clause-summary.ts
│   │   │   ├── contradiction-detection.ts
│   │   │   ├── extract-text.ts
│   │   │   ├── fairness-benchmark.ts
│   │   │   ├── glossary-generation.ts
│   │   │   └── text-to-speech.ts
│   │   ├── dev.ts             # Genkit development server entrypoint
│   │   └── genkit.ts          # Genkit global configuration
│   │
│   ├── components/
│   │   ├── app/               # Application-specific components
│   │   │   ├── chat-view.tsx
│   │   │   ├── contradiction-view.tsx
│   │   │   ├── document-viewer.tsx
│   │   │   ├── fairness-benchmark-view.tsx
│   │   │   ├── glossary-view.tsx
│   │   │   ├── logo.tsx
│   │   │   ├── main-sidebar.tsx
│   │   │   ├── summary-view.tsx
│   │   │   └── upload-form.tsx
│   │   └── ui/                # Reusable UI components from ShadCN
│   │
│   ├── hooks/
│   │   ├── use-recent-documents.ts # Manages document history in localStorage
│   │   └── use-toast.ts            # Hook for displaying notifications
│   │
│   └── lib/
│       ├── actions.ts         # Server Actions that call Genkit flows
│       ├── types.ts           # Core TypeScript type definitions (e.g., Document)
│       └── utils.ts           # Utility functions (e.g., cn for classnames)
│
├── next.config.ts             # Next.js configuration
└── package.json               # Project dependencies and scripts
```

## 5. Component Breakdown

### `src/components/app/`

- **`upload-form.tsx`**: The main form on the landing page for uploading or pasting document text. Handles file validation, drag-and-drop, and initiates the text extraction process.
- **`main-sidebar.tsx`**: The collapsible navigation sidebar that displays recent documents and allows users to delete them or start a new analysis.
- **`document-viewer.tsx`**: The panel on the dashboard that displays the original uploaded document (PDF, DOCX, or image).
- **`summary-view.tsx`**: Renders the AI-generated clause-by-clause summaries in an accordion format.
- **`glossary-view.tsx`**: Displays the list of AI-detected legal terms and their definitions. Includes the button to trigger text-to-speech for each term.
- **`fairness-benchmark-view.tsx`**: Shows the results of the fairness analysis, highlighting potentially unfair clauses with severity levels.
- **`contradiction-view.tsx`**: Presents any detected contradictions, showing the conflicting clauses and an AI explanation.
- **`chat-view.tsx`**: Provides a full chat interface for users to ask questions about the document and receive AI-generated answers.
- **`logo.tsx`**: A simple component for displaying the app's logo and name.

## 6. AI Flows Breakdown

### `src/ai/flows/`

- **`extract-text.ts`**: Takes a document file (as a data URI) and uses a multimodal model to extract all text content.
- **`clause-by-clause-summary.ts`**: Identifies distinct legal clauses in a block of text and generates a plain English summary for each one.
- **`glossary-generation.ts`**: Scans the document text to find legal terms and creates a glossary with definitions.
- **`fairness-benchmark.ts`**: Analyzes the document against Indian legal norms and flags clauses that are unusual or stricter than standard practice.
- **`contradiction-detection.ts`**: Examines the document to find pairs of clauses that contradict each other and explains why.
- **`chat.ts`**: Powers the chat assistant, providing conversational answers to user questions based on the document's content.
- **`text-to-speech.ts`**: Converts a given string of text into audible speech using Google's TTS model, returning it as a base64-encoded WAV file.

## 7. Setup & Deployment

### Running Locally

1.  **Install Dependencies**: `npm install`
2.  **Environment Variables**: Create a `.env` file and add your `GEMINI_API_KEY`.
3.  **Run the App**: `npm run dev`
4.  **Run Genkit**: `npm run genkit:watch` (in a separate terminal)

### Deployment

The application is configured for easy deployment on platforms like **Vercel**. When deploying, Vercel will automatically detect the Next.js framework. The **root directory** should be set to the base of the project repository.
