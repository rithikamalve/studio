'use server';
/**
 * @fileOverview Implements the Reverse Q&A flow, highlighting relevant clauses in a document based on a user's question.
 *
 * - reverseQAndA -  A function that takes a document and a question, and returns the clauses from the document relevant to answering the question.
 * - ReverseQAndAInput - The input type for the reverseQAndA function.
 * - ReverseQAndAOutput - The return type for the reverseQAndA function, containing the relevant clauses.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReverseQAndAInputSchema = z.object({
  documentText: z.string().describe('The complete text of the document to analyze.'),
  question: z.string().describe('The question to answer using the document.'),
});
export type ReverseQAndAInput = z.infer<typeof ReverseQAndAInputSchema>;

const ReverseQAndAOutputSchema = z.object({
  relevantClauses: z
    .array(z.string())
    .describe('The clauses from the document that are relevant to answering the question.'),
});
export type ReverseQAndAOutput = z.infer<typeof ReverseQAndAOutputSchema>;

export async function reverseQAndA(input: ReverseQAndAInput): Promise<ReverseQAndAOutput> {
  return reverseQAndAFlow(input);
}

const findRelevantClauses = ai.defineTool({
  name: 'findRelevantClauses',
  description: 'Given a document and a question, returns the clauses from the document that are relevant to answering the question.',
  inputSchema: ReverseQAndAInputSchema,
  outputSchema: z.array(z.string()),
},
async (input) => {
  const {
    documentText,
    question
  } = input;
  const clauses = documentText.split(/\n\s*\n/); // Split into clauses based on double newlines.

  // Filter out empty clauses
  const nonEmptyClauses = clauses.filter(clause => clause.trim() !== '');

  const relevantClauses: string[] = [];
  for (const clause of nonEmptyClauses) {
    const { text } = await ai.generate({
      prompt: `You are an expert legal document analyzer. Your job is to determine whether the following clause is relevant to the question asked.\n\nQuestion: ${question}\n\nClause: ${clause}\n\nIs this clause relevant to the question? Answer YES or NO.`,
      config: {
        temperature: 0.2,
      },
    });

    if (text?.trim().toUpperCase().startsWith('YES')) {
      relevantClauses.push(clause);
    }
  }

  return relevantClauses;
});

const prompt = ai.definePrompt({
  name: 'reverseQAndAPrompt',
  tools: [findRelevantClauses],
  input: {schema: ReverseQAndAInputSchema},
  output: {schema: ReverseQAndAOutputSchema},
  prompt: `Use the available tools to answer the question, highlighting the relevant clauses in the document.

Question: {{{question}}}
Document: {{{documentText}}}`,
  system: `You are an AI assistant designed to analyze documents and answer questions.
  You must use the available tools to answer the question.`, 
  
});

const reverseQAndAFlow = ai.defineFlow(
  {
    name: 'reverseQAndAFlow',
    inputSchema: ReverseQAndAInputSchema,
    outputSchema: ReverseQAndAOutputSchema,
  },
  async input => {
    const relevantClauses = await findRelevantClauses(input);
    return {relevantClauses};
  }
);
