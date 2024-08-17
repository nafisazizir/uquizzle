import { generateObject } from "ai";
import { openai } from "./openai";
import { z } from "zod";
import { getContent, getContentTimestamp } from "./transcript";

export const generateLectureNotes = async (transcriptText) => {
  const content = await getContentTimestamp(transcriptText);

  const prompt = `You are an expert in generating comprehensive lecture notes. Based on the following content, generate detailed lecture notes that capture all relevant course material, ensuring that no important content is missed. Your task is to identify, categorize, and infer all core course-related information while excluding unimportant or filler content.

  ### Instructions:
  1. **Deep Understanding**: Fully comprehend the content of the transcript, going beyond the literal text to grasp implied concepts, connections, and any inferred information that may be relevant to the course material.
  2. **Thorough Review**: Meticulously review the entire transcript to identify every instance of core course material, concepts, principles, and important course-related announcements (e.g., assignment deadlines, exam hints, group project details). Pay close attention to details, ensuring that no relevant content is missed.
  3. **Complete Coverage**: Ensure that every relevant course material covered in the transcript is included. If similar concepts are mentioned in different sections, consolidate them under a single title. Avoid multiple titles for related sections.
  4. **Core Content and Inferences**: Focus on segments where core concepts or specific details related to the course material are discussed. Also, infer any relevant information that might not be explicitly stated but can be deduced from the context.
  5. **Critical Course Information**: Include any information about assignments, exams, project deadlines, or other essential course-related details mentioned or implied in the transcript.
  6. **Key Point Summaries**: Summarize key points and important sections, both for course material and essential course information, ensuring nothing is overlooked.
  7. **Organize by Topic**: Bundle related concepts and materials under a single title. Avoid creating multiple titles for the same or closely related topics.
  8. **Bullet Point Explanations**: Present explanations and detailed information in bullet points.
  9. **Timestamps**: Include the timestamp(s) in milliseconds where the data is originally from in the transcript for each bullet point.
  10.**Inferred Information**: Infer and include relevant information that may not be explicitly stated but is implied or can be logically concluded based on the content of the transcript. Ensure that these inferences are clearly explained in the notes.
  11. **Repetitive Examination**: After generating the notes, thoroughly reexamine the output to ensure that it includes all relevant material. Reassess the transcript and cross-check with the notes multiple times to catch any missed or inferred content. Expand and refine the notes as needed.
  12. **Final Improvement**: Perform a final pass over the lecture notes to further improve and ensure complete coverage of all core material and course-related information.
  13. **Comprehensive Length**: The length of the output is not an issue; it can be as long as needed. Include any and everything relevant to the course so that absolutely nothing is left out.

  ### Output Format:
  Return a JSON array where each entry contains:
  - "title": The title of the lecture notes section, bundling all related content.
  - "content": An array consisting of texts that are relevant to the material or course information, formatted as bullet points, with timestamps indicating where in the transcript the information is found.

  Format your response as an array of lecture notes objects, grouping similar content under a single title:
  [
  {
      "title": "Course Information",
      "content": [
      {
          "text": "Important announcement about assignment deadlines.",
          "timestamps": ["1110", "3549"]
      },
      {
          "text": "Exam hints provided by the instructor.",
          "timestamps": ["6050", "7400"]
      }
      ]
  },
  {
      "title": "Understanding Function Pointers",
      "content": [
      {
          "text": "Function pointers allow functions to be passed as arguments.",
          "timestamps": ["419100", "62119"]
      },
      {
          "text": "Examples of function usage in sorting algorithms.",
          "timestamps": ["116800", "138570"]
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
