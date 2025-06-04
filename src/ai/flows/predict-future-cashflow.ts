
'use server';

/**
 * @fileOverview Predicts future cash flow based on historical data and financial goals.
 *
 * - predictFutureCashFlow - A function that handles the cash flow prediction process.
 * - PredictFutureCashFlowInput - The input type for the predictFutureCashFlow function.
 * - PredictFutureCashFlowOutput - The return type for the predictFutureCashFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictFutureCashFlowInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical cash flow data, including dates, income, and expenses. Must be a CSV string.'
    ),
  financialGoals: z.string().describe('User defined financial goals.'),
  predictionHorizon: z
    .string()
    .describe('The time period (e.g., "next month", "next quarter", "next year") for which the cash flow should be predicted.'),
});
export type PredictFutureCashFlowInput = z.infer<typeof PredictFutureCashFlowInputSchema>;

const PredictFutureCashFlowOutputSchema = z.object({
  predictedCashFlow: z
    .string()
    .describe('Predicted cash flow for the specified time period, along with insights and recommendations.'),
});
export type PredictFutureCashFlowOutput = z.infer<typeof PredictFutureCashFlowOutputSchema>;

export async function predictFutureCashFlow(input: PredictFutureCashFlowInput): Promise<PredictFutureCashFlowOutput> {
  return predictFutureCashFlowFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictFutureCashFlowPrompt',
  input: {schema: PredictFutureCashFlowInputSchema},
  output: {schema: PredictFutureCashFlowOutputSchema},
  prompt: `You are a financial advisor specializing in cash flow forecasting.

You will use the provided historical cash flow data and the user's financial goals to predict their future cash flow for the specified time period.

Historical Data: {{{historicalData}}}
Financial Goals: {{{financialGoals}}}
Prediction Horizon: {{{predictionHorizon}}}

Provide a clear and concise prediction of the user's cash flow, highlighting potential shortfalls or surpluses. Offer actionable insights and recommendations to help the user make informed financial decisions.
`,
});

const predictFutureCashFlowFlow = ai.defineFlow(
  {
    name: 'predictFutureCashFlowFlow',
    inputSchema: PredictFutureCashFlowInputSchema,
    outputSchema: PredictFutureCashFlowOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
