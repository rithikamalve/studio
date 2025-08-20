'use server';

import {
  summarizeClauses as summarizeClausesFlow,
  type SummarizeClausesInput,
  type SummarizeClausesOutput,
} from '@/ai/flows/clause-by-clause-summary';
import {
  generateGlossary as generateGlossaryFlow,
  type GlossaryGenerationInput,
  type GlossaryGenerationOutput,
} from '@/ai/flows/glossary-generation';
import {
  reverseQAndA as reverseQAndAFlow,
  type ReverseQAndAInput,
  type ReverseQAndAOutput,
} from '@/ai/flows/reverse-q-and-a';

export async function summarizeClauses(input: SummarizeClausesInput): Promise<SummarizeClausesOutput> {
  try {
    return await summarizeClausesFlow(input);
  } catch (error) {
    console.error("Error in summarizeClauses action:", error);
    throw new Error("Failed to generate summary. Please try again.");
  }
}

export async function generateGlossary(input: GlossaryGenerationInput): Promise<GlossaryGenerationOutput> {
   try {
    return await generateGlossaryFlow(input);
  } catch (error) {
    console.error("Error in generateGlossary action:", error);
    throw new Error("Failed to generate glossary. Please try again.");
  }
}

export async function reverseQAndA(input: ReverseQAndAInput): Promise<ReverseQAndAOutput> {
   try {
    return await reverseQAndAFlow(input);
  } catch (error) {
    console.error("Error in reverseQAndA action:", error);
    throw new Error("Failed to get answer. Please try again.");
  }
}
