import { config } from 'dotenv';
config();

import '@/ai/flows/generate-financial-insights.ts';
import '@/ai/flows/predict-future-cashflow.ts';
import '@/ai/flows/summarize-cashflow-trends.ts';