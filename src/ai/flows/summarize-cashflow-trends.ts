// SummarizeCashFlowTrends
'use server';
/**
 * @fileOverview This file defines a Genkit flow to summarize cash flow trends.
 *
 * - summarizeCashFlowTrends - A function that analyzes cash flow data and provides a summary of key trends.
 * - SummarizeCashFlowTrendsInput - The input type for the summarizeCashFlowTrends function.
 * - SummarizeCashFlowTrendsOutput - The return type for the summarizeCashFlowTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCashFlowTrendsInputSchema = z.object({
  cashFlowData: z
    .string()
    .describe(
      'A string containing the cash flow data to analyze. Should include dates, descriptions, and amounts for all transactions.'
    ),
});
export type SummarizeCashFlowTrendsInput = z.infer<typeof SummarizeCashFlowTrendsInputSchema>;

const SummarizeCashFlowTrendsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of key cash flow trends, including significant income sources, expense patterns, and potential areas for improvement.'
    ),
});
export type SummarizeCashFlowTrendsOutput = z.infer<typeof SummarizeCashFlowTrendsOutputSchema>;

export async function summarizeCashFlowTrends(input: SummarizeCashFlowTrendsInput): Promise<SummarizeCashFlowTrendsOutput> {
  return summarizeCashFlowTrendsFlow(input);
}

const summarizeCashFlowTrendsPrompt = ai.definePrompt({
  name: 'summarizeCashFlowTrendsPrompt',
  input: {schema: SummarizeCashFlowTrendsInputSchema},
  output: {schema: SummarizeCashFlowTrendsOutputSchema},
  prompt: `You are an expert financial analyst. Analyze the following cash flow data and provide a concise summary of key trends, including significant income sources, expense patterns, and potential areas for improvement.

Cash Flow Data:
{{{cashFlowData}}}`,
});

const summarizeCashFlowTrendsFlow = ai.defineFlow(
  {
    name: 'summarizeCashFlowTrendsFlow',
    inputSchema: SummarizeCashFlowTrendsInputSchema,
    outputSchema: SummarizeCashFlowTrendsOutputSchema,
  },
  async input => {
    const {output} = await summarizeCashFlowTrendsPrompt(input);
    return output!;
  }
);
