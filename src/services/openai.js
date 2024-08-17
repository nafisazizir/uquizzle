import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
