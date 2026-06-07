// AI service calls OpenAI's Responses API from the backend so API keys never reach the browser.
import OpenAI from 'openai';
import { env } from '../config/env.js';

const systemInstructions = `
You are Agricore Assistant, a polished enterprise agriculture support chatbot.
Help users with any reasonable question they ask, while using Agricore's platform context when useful.
You are especially strong on bookings, admin dashboards, user dashboards, farm operations, crop forecasts,
water efficiency, sustainability reporting, enterprise agriculture workflows, and how to use this web application.
Be concise, practical, friendly, and professional.
Use clean plain text without Markdown formatting because the chat renders messages as plain text.
When the question is not about Agricore, still answer helpfully if it is safe and appropriate.
If a question is unclear, make a reasonable assumption and give the user a clear next step.
If the user asks for account changes, tell them which dashboard action to use.
If asked for legal, financial, or agronomic certainty, give general guidance and recommend expert review.
Decline unsafe, harmful, or credential-seeking requests and redirect to safe platform help.
Never claim to have performed an action unless the application provides that capability.
`;

export async function answerAgricoreQuestion({ message, context }) {
  if (!env.openaiApiKey) {
    return {
      answer:
        'AI chat is ready in the application, but the backend needs OPENAI_API_KEY configured. Add a rotated key to your environment, restart Docker, and I can answer Agricore platform questions here.',
      configured: false
    };
  }

  const client = new OpenAI({ apiKey: env.openaiApiKey });
  const response = await client.responses.create({
    model: env.openaiModel,
    instructions: systemInstructions,
    input: [
      {
        role: 'user',
        content: `User role: ${context?.role ?? 'PUBLIC'}\nCurrent page: ${
          context?.page ?? 'Agricore website'
        }\nQuestion: ${message}`
      }
    ],
    store: false,
    text: {
      verbosity: 'low'
    }
  });

  return {
    answer: response.output_text,
    configured: true,
    model: env.openaiModel
  };
}
