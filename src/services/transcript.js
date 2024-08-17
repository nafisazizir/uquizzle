export async function preprocessTranscript(transcriptText) {
  const parsedData = transcriptText;

  const concatenatedContent = parsedData.data.contentJSON.cues
    .map((cue) => cue.content)
    .join(" ");

  // testing purpose, only limit to 200 words!
  const limitedContent = concatenatedContent.split(" ").slice(0, 200).join(" ");
  return limitedContent;

  // use this return in prod!!
  // return concatenatedContent;
}
