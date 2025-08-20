# **App Name**: Nomiko

## Core Features:

- Document Handling: Dashboard for uploading and viewing documents (PDF, DOCX, TXT or pasted text).
- Original Document View: Display original document content in a scrollable view with clause highlighting.
- Reverse Q&A: AI powered Question Answering: Highlights clauses relevant to user queries. Uses an LLM as a tool to locate those relevant clauses in the document text.
- Clause-by-Clause Summary: Summarize document clauses in plain English.
- Glossary Generation: Generate an AI-powered glossary of legal terms from the document with definitions and text-to-speech functionality. Uses an LLM as a tool when constructing the legal definitions.
- Chat Assistant: Chat interface for conversational document analysis.
- Persistent Recent Documents: Saves most recent documents to browser localStorage. Provides a means of re-accessing them for analysis

## Style Guidelines:

- Primary color: A calming, professional blue (#3B82F6), reflecting trust and authority.
- Background color: A light, desaturated blue (#F0F9FF) to provide a clean and unobtrusive backdrop.
- Accent color: A vibrant, analogous purple (#8B5CF6) to draw attention to interactive elements and AI insights.
- Body and headline font: 'Inter' (sans-serif) for a modern, readable, and neutral look. 'Inter' will be used for all text.
- Use professional, clear icons from a set like Material Design Icons to represent document types and analysis features.
- Implement a clean layout with a fixed left sidebar for navigation and a main content area using Card components for sections.
- Subtle animations for loading states using Skeleton components and toast notifications for actions and errors.