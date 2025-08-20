'use server';

/**
 * @fileOverview Provides a Genkit flow for a chat assistant.
 *
 * - chat - A function that takes document text and a question and returns a conversational answer.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the document to chat about.'),
  question: z.string().describe('The user question about the document.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  answer: z
    .string()
    .describe('The AI-generated answer to the question based on the document.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are an AI legal assistant. Your task is to answer questions about the provided legal document. Base your answers strictly on the document's content. If the answer is not in the document, state that clearly.

Document Text:
{{{documentText}}}

Question:
{{{question}}}
`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
