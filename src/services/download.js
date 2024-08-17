import questions from "./questions.json";
import lectureNotes from "./lectureNotes.json"
import { PDFDocument, rgb } from "pdf-lib";
import { marked } from "marked";

const convertQuestionToMarkdown = (lectureTitle) => {
  try {
    let markdownContent = `# Quizzle - ${lectureTitle}\n\n`;

    markdownContent += questions
      .map((question) => {
        let markdown = `${question.question_id}. ${question.question}\n`;

        question.options.forEach((option, index) => {
          markdown += `    ${index + 1}. ${option}\n`;
        });

        markdown += `\n    **Correct answer: ${question.correctAnswer}**\n`;

        markdown += `\n    **Explanation**\n`;
        question.explanation.forEach((explanationItem, index) => {
          markdown += `\n    ${index + 1}. ${
            question.options[index]
          }\n        ${explanationItem}\n`;
        });

        return markdown;
      })
      .join("\n\n");

    markdownContent = markdownContent.replace(/'''/g, "```");

    return markdownContent;
  } catch (error) {
    console.error("Error converting questions to markdown:", error);
    throw error;
  }
};

const convertLectureNotesToMarkdown = (lectureTitle) => {
  try {
    let markdownContent = `# Quizzle - ${lectureTitle}\n\n`;

    lectureNotes.forEach((topic) => {
      markdownContent += `## ${topic.title}\n\n`;

      topic.content.forEach((item, index) => {
        // Add the content text as a subtitle
        markdownContent += `- ${item.text}\n\n`;
      });

      // Add a separator line after each topic
      // markdownContent += "---\n\n";
    });

    return markdownContent;
  } catch (error) {
    console.error("Error converting lecture notes to markdown:", error);
    throw error;
  }
};


const convertMarkdownToPdf = async (markdownContent) => {
  try {
    const htmlContent = marked(markdownContent);
    console.log(htmlContent);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();

    page.drawText(htmlContent, {
      x: 50,
      y: height - 50,
      size: 12,
      color: rgb(0, 0, 0),
      maxWidth: width - 100,
    });

    const pdfBuffer = await pdfDoc.save();

    return pdfBuffer;
  } catch (error) {
    console.error("Error converting questions to pdf:", error);
    throw error;
  }
};

const downloadQuestionMarkdown = (markdownContent) => {
  try {
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "question.md";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("Markdown file downloaded successfully!");
  } catch (error) {
    console.error("Error downloading markdown file:", error);
  }
};

const downloadLectureNotesMarkdown = (markdownContent) => {
  try {
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "lecture_notes.md";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("Markdown file downloaded successfully!");
  } catch (error) {
    console.error("Error downloading markdown file:", error);
  }
};

const downloadQuestionPdf = (pdfBuffer) => {
  try {
    const blob = new Blob([pdfBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "question.pdf";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("PDF file downloaded successfully!");
  } catch (error) {
    console.error("Error converting Markdown to PDF and downloading:", error);
  }
};

export const convertQuestionToMarkdownAndDownload = async (lectureTitle) => {
  try {
    const markdownContent = convertQuestionToMarkdown(lectureTitle);
    downloadQuestionMarkdown(markdownContent);
  } catch (error) {
    console.error(
      "Error in converting questions to .md and downloading:",
      error
    );
  }
};

export const convertQuestionToPdfAndDownload = async (lectureTitle) => {
  try {
    const markdownContent = convertQuestionToMarkdown(lectureTitle);
    const pdfBuffer = convertMarkdownToPdf(markdownContent);
    downloadQuestionPdf(pdfBuffer);
  } catch (error) {
    console.error(
      "Error in converting questions to .pdf and downloading:",
      error
    );
  }
};

export const convertLectureNotesToMarkdownAndDownload = async (lectureTitle) => {
  try {
    const markdownContent = convertLectureNotesToMarkdown(lectureTitle);
    downloadLectureNotesMarkdown(markdownContent);
  } catch (error) {
    console.error(
      "Error in converting lecture notes to .md and downloading:",
      error
    );
  }
};
