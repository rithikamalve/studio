'use server';
/**
 * @fileOverview A Genkit flow for extracting text from various document types.
 *
 * - extractText - A function that takes a document and returns the extracted text.
 * - ExtractTextInput - The input type for the extractText function.
 * - ExtractTextOutput - The return type for the extractText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTextInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document file (image, PDF, or DOCX) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTextInput = z.infer<typeof ExtractTextInputSchema>;

const ExtractTextOutputSchema = z.object({
  text: z.string().describe('The extracted text from the document.'),
});
export type ExtractTextOutput = z.infer<typeof ExtractTextOutputSchema>;

export async function extractText(input: ExtractTextInput): Promise<ExtractTextOutput> {
  return extractTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTextPrompt',
  input: {schema: ExtractTextInputSchema},
  output: {schema: ExtractTextOutputSchema},
  prompt: `Extract the text from the following document.
  
  Document: {{media url=documentDataUri}}
  `,
  config: {
    temperature: 0.1,
  },
});

const extractTextFlow = ai.defineFlow(
  {
    name: 'extractTextFlow',
    inputSchema: ExtractTextInputSchema,
    outputSchema: ExtractTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Text extraction failed to return text.');
    }
    return output;
  }
);
