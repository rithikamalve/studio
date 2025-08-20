'use server';

/**
 * @fileOverview Generates a glossary of legal terms from a document.
 *
 * - generateGlossary - A function that generates the glossary.
 * - GlossaryGenerationInput - The input type for the generateGlossary function.
 * - GlossaryGenerationOutput - The return type for the generateGlossary function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const GlossaryGenerationInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the document to generate a glossary from.'),
});
export type GlossaryGenerationInput = z.infer<typeof GlossaryGenerationInputSchema>;

const GlossaryEntrySchema = z.object({
  term: z.string().describe('The legal term.'),
  definition: z.string().describe('The definition of the legal term.'),
});

const GlossaryGenerationOutputSchema = z.array(GlossaryEntrySchema).describe('An array of glossary entries.');
export type GlossaryGenerationOutput = z.infer<typeof GlossaryGenerationOutputSchema>;

export async function generateGlossary(input: GlossaryGenerationInput): Promise<GlossaryGenerationOutput> {
  return glossaryGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'glossaryGenerationPrompt',
  input: {schema: GlossaryGenerationInputSchema},
  output: {schema: GlossaryGenerationOutputSchema},
  config: {
    model: googleAI.model('gemini-2.0-flash'),
  },
  prompt: `You are an expert legal professional. Generate a glossary of legal terms from the following document. Each entry should have a term and definition.

Document Text: {{{documentText}}}

Glossary:
`, // Ensure output matches the GlossaryGenerationOutputSchema
});

const glossaryGenerationFlow = ai.defineFlow(
  {
    name: 'glossaryGenerationFlow',
    inputSchema: GlossaryGenerationInputSchema,
    outputSchema: GlossaryGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
