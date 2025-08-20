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
  extractText as extractTextFlow,
  type ExtractTextInput,
  type ExtractTextOutput
} from '@/ai/flows/extract-text';
import {
    chat as chatFlow,
    type ChatInput,
    type ChatOutput
} from '@/ai/flows/chat';
import {
    textToSpeech as textToSpeechFlow,
    type TextToSpeechInput,
    type TextToSpeechOutput
} from '@/ai/flows/text-to-speech';
import {
    benchmarkFairness as benchmarkFairnessFlow,
    type FairnessBenchmarkInput,
    type FairnessBenchmarkOutput
} from '@/ai/flows/fairness-benchmark';
import {
    detectContradictions as detectContradictionsFlow,
    type ContradictionDetectionInput,
    type ContradictionDetectionOutput
} from '@/ai/flows/contradiction-detection';


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

export async function extractText(input: ExtractTextInput): Promise<ExtractTextOutput> {
  try {
    return await extractTextFlow(input);
  } catch (error) {
    console.error("Error in extractText action:", error);
    throw new Error("Failed to extract text from the document. Please ensure the file is valid and not corrupted.");
  }
}

export async function chat(input: ChatInput): Promise<ChatOutput> {
    try {
        return await chatFlow(input);
    } catch (error) {
        console.error("Error in chat action:", error);
        throw new Error("The AI assistant failed to respond. Please try again.");
    }
}

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
    try {
        return await textToSpeechFlow(input);
    } catch (error) {
        console.error("Error in textToSpeech action:", error);
        throw new Error("Failed to generate audio. Please try again.");
    }
}

export async function benchmarkFairness(input: FairnessBenchmarkInput): Promise<FairnessBenchmarkOutput> {
    try {
        return await benchmarkFairnessFlow(input);
    } catch (error) {
        console.error("Error in benchmarkFairness action:", error);
        throw new Error("Failed to benchmark fairness. Please try again.");
    }
}

export async function detectContradictions(input: ContradictionDetectionInput): Promise<ContradictionDetectionOutput> {
    try {
        return await detectContradictionsFlow(input);
    } catch (error) {
        console.error("Error in detectContradictions action:", error);
        throw new Error("Failed to detect contradictions. Please try again.");
    }
}
