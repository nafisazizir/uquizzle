import { generateObject } from "ai";
import { openai } from "./openai";
import { z } from "zod";
import { getContent, getContentTimestamp } from "./transcript";

const preprocessQuestionsUserChoice = (questions, userChoices) => {
  return questions.map((question) => {
    const userAnswer = userChoices.find(
      (choice) => choice.question_id === question.question_id
    )?.userChoice;

    return {
      question_id: question.question_id,
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      userChoice: userAnswer,
      timestamp: question.timestamp,
    };
  });
};

export const generateFeedback = async (
  transcriptText,
  questions,
  userChoice
) => {
  const transcript = await getContentTimestamp(transcriptText);
  const transcriptJsonString = JSON.stringify(transcript, null, 2);
  const preprocessedQuestions = preprocessQuestionsUserChoice(
    questions,
    userChoice
  );
  const preprocessedQuestionsJsonString = JSON.stringify(
    preprocessedQuestions,
    null,
    2
  );

  const prompt = `You are an expert in educational assessment and feedback generation. You have been given the results of a quiz taken by a student based on a lecture transcript. Your task is to analyze the student's performance, identify their strengths and weaknesses by topic, and provide recommendations for areas to review.

      Instructions:
      1. **Analyze Quiz Results**: You will be provided with the lecture transcript, quiz questions, the student's answers, and the correct answers. Use this data to assess the student's accuracy on each topic.
      2. **Categorize by Topic**: For each topic covered in the quiz, calculate the student's accuracy and categorize it into either a strength or a weakness. Strengths are topics where the student performed well, and weaknesses are topics where the student needs improvement.
      3. **Provide Key Points**: For each strength, list key points that contributed to their success. For each weakness, list key points that highlight areas for improvement.
      4. **Offer Recommendations**: Based on the weaknesses, provide a list of actionable recommendations. These should be specific and help guide the student on what to focus on when reviewing the material.
      5. **Output Format**: Return a JSON object that includes the following structure:
      - "strength": An array of objects, each containing:
          - "topic": The topic where the student performed well.
          - "accuracy": The percentage of correct answers for that topic.
          - "questionsCovered": An array of question numbers where the topic was covered.
          - "keyPoints": An array of bullet points explaining why this is a strength.
      - "weakness": An array of objects, each containing:
          - "topic": The topic where the student needs improvement.
          - "accuracy": The percentage of correct answers for that topic.
          - "questionsCovered": An array of question numbers where the topic was covered.
          - "keyPoints": An array of bullet points explaining why this is a weakness.
      - "recommendation": An array of actionable key points that the student should focus on to improve in their weak areas.

      The data is:
      - "questions": An array of quiz questions and the user's answer.
      - "lectureTranscript": the transcript of the lecture

      lectureTranscript: ${transcriptJsonString}

      questions: ${preprocessedQuestionsJsonString}

      Please analyze the student's performance and provide feedback based on the instructions above.

      Example Output:
      {
      "strength": [
          {
          "topic": "Logical Operators",
          "accuracy": 90,
          "keyPoints": [
              "You consistently demonstrated an understanding of short-circuit evaluation.",
              "You correctly identified logical operator behavior in various scenarios."
          ]
          }
      ],
      "weakness": [
          {
          "topic": "Memory Management",
          "accuracy": 60,
          "keyPoints": [
              "You struggled with questions related to memory allocation.",
              "There was confusion regarding dynamic vs static memory allocation."
          ]
          }
      ],
      "recommendation": [
          "Review memory allocation concepts, focusing on dynamic vs static allocation.",
          "Practice more problems related to memory management and error handling."
      ]
      }
  `;

  const { object: userPerformance } = await generateObject({
    model: openai("gpt-4o-mini"),
    prompt: prompt,
    schema: z.object({
      strength: z.array(
        z.object({
          topic: z.string().describe("The topic where the user performed well"),
          accuracy: z
            .number()
            .min(0)
            .max(100)
            .describe("The percentage of correct answers for this topic"),
          questionsCovered: z
            .array(z.number())
            .describe("Array of question numbers where the topic was covered"),
          keyPoints: z
            .array(z.string())
            .describe("Bullet points describing why this topic is a strength"),
        })
      ),
      weakness: z.array(
        z.object({
          topic: z
            .string()
            .describe("The topic where the user needs improvement"),
          accuracy: z
            .number()
            .min(0)
            .max(100)
            .describe("The percentage of correct answers for this topic"),
          questionsCovered: z
            .array(z.number())
            .describe("Array of question numbers where the topic was covered"),
          keyPoints: z
            .array(z.string())
            .describe("Bullet points describing why this topic is a weakness"),
        })
      ),
      recommendation: z.array(
        z.string().describe("Key points for recommended actions")
      ),
    }),
  });

  return userPerformance;
};
