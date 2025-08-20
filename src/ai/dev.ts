'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/clause-by-clause-summary.ts';
import '@/ai/flows/glossary-generation.ts';
import '@/ai/flows/extract-text.ts';
import '@/ai/flows/chat.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/fairness-benchmark.ts';
import '@/ai/flows/contradiction-detection.ts';
