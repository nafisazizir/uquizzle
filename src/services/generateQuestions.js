import { generateObject } from "ai";
import { openai } from "./openai";
import { z } from "zod";
import { getContent, getContentTimestamp } from "./transcript";

export const generateQuestions = async (transcriptText) => {
  const content = await getContentTimestamp(transcriptText);
  
  const prompt = `You are an expert quiz creator tasked with generating multiple-choice questions from lecture transcript excerpts. The data contains timestamps and spoken content, and your job is to identify and categorize relevant course material content, then formulate quiz questions.

  Instructions:
  1.Segment the Content: First, split the transcript into 1-minute segments based on the timestamps.
  2.Categorize by Material: Review each 1-minute segment and categorize them based on the course material they pertain to. Material may be discussed non-contiguously, so categorize based on overall relevance (e.g., Material A: minute 1, minute 4, minute 9).
  3.Identify Core Content: Focus only on segments where core concepts or specific details related to the course material are discussed. Ignore introductory, filler, or unrelated content.
  4.Formulate Questions: For each categorized material, generate 10 questions that test understanding of the key concepts. Ensure the questions are clear and directly related to the material.
  5.Provide Options and Explanations: Include one correct answer and three plausible distractors for each question. Also, provide a concise explanation for why the correct answer is accurate and why the incorrect answer is inaccurate.
  6.Code Formatting: Every instance of code, function names, or syntax elements in questions, options, or explanations, wrap the code in triple quotes ''' so that it can be easily identified and styled as code in the frontend.
  7.Timestamp the Answer: Include the timestamp from the original data where the correct answer is derived.

  The content is:
  ${content}

  Output Format:
  Return a JSON array where each entry contains:
  - "question_id": A unique identifier for the question.
  - "question": The multiple-choice question.
  - "options": An array of four possible answers.
  - "correctAnswer": The correct answer from the options.
  - "explanation": An explanation for why the correct answer is correct or wrong.
  - "timestamp": The Ms in the original data where the correct answer is found.

  Example Output:
  [
    {
      "question_id": 1,
      "question": "What is the result of the expression '''if (x && func())''' when x is false?",
      "options": [
        "func() is called",
        "'''func()''' is not called",
        "x is evaluated first",
        "The expression is true"
      ],
      "correctAnswer": "'''func()''' is not called",
      "explanation": [
        "In C, if the first operand of a logical AND (&&) is false, the second operand '''func()''' is not evaluated, so '''func()''' is not called.",
        "If x is false, '''func()''' will not be called due to short-circuit evaluation in logical AND operations.",
        "The expression evaluates x first, but since it is false, '''func()''' is not evaluated.",
        "The overall expression cannot be true if x is false, so the expression is false."
      ],
      "timestamp": 1853069
    },
    ...
  ]`;

  const { object: generatedQuestions } = await generateObject({
    model: openai("gpt-4o-mini"),
    prompt: prompt,
    schema: z.object({
      questions: z.array(z.object({
        question_id: z.number().describe("Unique identifier for the question"),
        question: z.string().describe("The question related to the material"),
        options: z.array(z.string()).length(4).describe("Four options for the question"),
        correctAnswer: z.string().describe("The correct answer among the options"),
        explanation: z.array(z.string()).describe("Explanation for why the correct answer is accurate and the wrong answer is incorrect"),
        timestamp: z.number().describe("The timestamp from the original data where the correct answer is found"),
      })),
    }),
  });

  return generatedQuestions.questions;
};
