// src/ai/flows/generate-financial-insights.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized financial insights based on user data.
 *
 * The flow takes financial data as input and uses an LLM to provide actionable recommendations for saving money, reducing debt, or optimizing investments.
 *
 * @interface GenerateFinancialInsightsInput - The input type for the generateFinancialInsights function.
 * @interface GenerateFinancialInsightsOutput - The output type for the generateFinancialInsights function.
 * @function generateFinancialInsights - The main function that triggers the financial insights generation flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFinancialInsightsInputSchema = z.object({
  income: z.number().describe('Monthly income.'),
  expenses: z.array(
    z.object({
      category: z.string().describe('Expense category (e.g., rent, food, transportation).'),
      amount: z.number().describe('Amount spent on this expense category.'),
    })
  ).describe('List of monthly expenses.'),
  debts: z.array(
    z.object({
      name: z.string().describe('Name of the debt (e.g., credit card, student loan).'),
      balance: z.number().describe('Outstanding balance on the debt.'),
      interestRate: z.number().describe('Annual interest rate on the debt (as a decimal).'),
      minimumPayment: z.number().describe('Minimum monthly payment for the debt.'),
    })
  ).describe('List of outstanding debts.'),
  savings: z.number().describe('Total amount of savings.'),
  financialGoals: z.string().describe('User-defined financial goals (e.g., buying a house, retirement).'),
});

export type GenerateFinancialInsightsInput = z.infer<typeof GenerateFinancialInsightsInputSchema>;

const GenerateFinancialInsightsOutputSchema = z.object({
  insights: z.string().describe('Personalized financial insights and recommendations.'),
});

export type GenerateFinancialInsightsOutput = z.infer<typeof GenerateFinancialInsightsOutputSchema>;

export async function generateFinancialInsights(input: GenerateFinancialInsightsInput): Promise<GenerateFinancialInsightsOutput> {
  return generateFinancialInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialInsightsPrompt',
  input: {schema: GenerateFinancialInsightsInputSchema},
  output: {schema: GenerateFinancialInsightsOutputSchema},
  prompt: `You are a financial advisor providing personalized advice.

  Based on the following financial data, provide actionable recommendations for saving money, reducing debt, or optimizing investments, tailored to help achieve the stated financial goals.

  Income: {{{income}}}
  Expenses:
  {{#each expenses}}
  - Category: {{{category}}}, Amount: {{{amount}}}
  {{/each}}
  Debts:
  {{#each debts}}
  - Name: {{{name}}}, Balance: {{{balance}}}, Interest Rate: {{{interestRate}}}, Minimum Payment: {{{minimumPayment}}}
  {{/each}}
  Savings: {{{savings}}}
  Financial Goals: {{{financialGoals}}}

  Provide insights in a clear and concise manner.
  `, 
});

const generateFinancialInsightsFlow = ai.defineFlow(
  {
    name: 'generateFinancialInsightsFlow',
    inputSchema: GenerateFinancialInsightsInputSchema,
    outputSchema: GenerateFinancialInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
