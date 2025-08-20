'use server';
/**
 * @fileOverview A Genkit flow for performing OCR on a document.
 *
 * - ocr - A function that takes a document image and returns the extracted text.
 * - OcrInput - The input type for the ocr function.
 * - OcrOutput - The return type for the ocr function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OcrInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "An image of a document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type OcrInput = z.infer<typeof OcrInputSchema>;

const OcrOutputSchema = z.object({
  text: z.string().describe('The extracted text from the document.'),
});
export type OcrOutput = z.infer<typeof OcrOutputSchema>;

export async function ocr(input: OcrInput): Promise<OcrOutput> {
  return ocrFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ocrPrompt',
  input: {schema: OcrInputSchema},
  output: {schema: OcrOutputSchema},
  prompt: `You are an OCR engine. Extract the text from the following document image.
  
  Document: {{media url=documentDataUri}}
  `,
  config: {
    temperature: 0.1,
  },
});

const ocrFlow = ai.defineFlow(
  {
    name: 'ocrFlow',
    inputSchema: OcrInputSchema,
    outputSchema: OcrOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('OCR processing failed to return text.');
    }
    return output;
  }
);
