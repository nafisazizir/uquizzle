import { generateObject } from "ai";
import { openai } from "./openai";
import { z } from "zod";
import { getContent, getContentTimestamp } from "./transcript";

export const generateLectureNotes = async (transcriptText) => {
  const content = await getContentTimestamp(transcriptText);

  const prompt = `You are an expert in generating lecture notes. Based on the following content, generate comprehensive lecture notes. The notes should include:
    - Key points
    - Summaries of important sections
    - Detailed information or explanations in bullet points
    - Each bullet point should include the timestamp(s) in Ms when the information was discussed in the lecture

    Format your response as an array of lecture notes objects:
    [
      {
        "title": "Title of the Section",
        "content": [
          {
            "text": "Detailed bullet point 1",
            "timestamps": ["419100", "419100"]
          },
          {
            "text": "Detailed bullet point 2",
            "timestamps": ["419100"]
          },
          {
            "text": "Detailed bullet point 3",
            "timestamps": ["419100", "419100"]
          }
        ]
      },
      {
        "title": "Another Section Title",
        "content": [
          {
            "text": "Detailed bullet point 1",
            "timestamps": ["419100"]
          },
          {
            "text": "Detailed bullet point 2",
            "timestamps": ["419100", "419100"]
          }
        ]
      }
    ]
    
    Content:

    ${content}`;

  const { object: generatedNotes } = await generateObject({
    model: openai("gpt-4o-mini"),
    temperature: 0.7,
    prompt: prompt,
    schema: z.object({
      notes: z.array(
        z.object({
          title: z.string().describe("Title of the section or topic"),
          content: z
            .array(
              z.object({
                text: z.string().describe("Detailed bullet point text"),
                timestamps: z
                  .array(z.number())
                  .describe(
                    "Array of timestamps when the information is discussed"
                  ),
              })
            )
            .describe("Array of detailed bullet points with timestamps"),
        })
      ),
    }),
  });

  return generatedNotes.notes;
};
