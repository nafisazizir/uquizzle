import { generateObject } from "ai";
import { openai } from "./openai";
import { z } from "zod";
import { preprocessTranscript } from "./transcript";

export const generateQuestions = async (transcriptText) => {
  const content = await preprocessTranscript(transcriptText);

  const prompt = `Based on the following content, generate multiple-choice questions (MCQs). Each MCQ should include:
      - The question text
      - A list of options (minimum of 2 options)
      - The index of the correct option

      Format your response as an array of MCQData objects:
      [
        {
          "questions": "Question 1",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctOptionIndex": 0
        },
        {
          "questions": "Question 2",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctOptionIndex": 1
        },
        ...
      ]

      Content:

      ${content}`;

  const { object: generatedQuestions } = await generateObject({
    model: openai("gpt-4o-mini"),
    temperature: 0.7,
    prompt: prompt,
    schema: z.object({
      mcqs: z.array(
        z.object({
          questions: z.string().describe("The text of the question"),
          options: z
            .array(z.string())
            .describe("List of options for the question"),
          correctOptionIndex: z
            .number()
            .describe("Index of the correct option"),
        })
      ),
    }),
  });

  return generatedQuestions.mcqs;
};
