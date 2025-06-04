'use server';

import {genkit, nextjs} from '@genkit-ai/next'; // Import genkit and nextjs from @genkit-ai/next
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    nextjs(), // Add the Next.js plugin
    googleAI(),
  ],
  model: 'googleai/gemini-2.0-flash',
});
