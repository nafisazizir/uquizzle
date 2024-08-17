export async function preprocessTranscript(transcriptText) {
  const parsedData = transcriptText;

  const concatenatedContent = parsedData.data.contentJSON.cues
    .map((cue) => cue.content)
    .join(" ");

  // testing purpose, only limit to 200 words!
  const limitedContent = concatenatedContent
    .split(" ")
    .slice(0, 1000)
    .join(" ");
  return limitedContent;

  // use this return in prod!!
  // return concatenatedContent;
}

export async function getContentTimestamp(transcriptText) {
  const parsedData = transcriptText;
  const response = parsedData.data.contentJSON.cues.map((cue) => {
    return {
      content: cue.content,
      startMs: cue.startMs,
      endMs: cue.endMs,
    };
  });

  // testing purpose limit the array!
  // return response.slice(0, 150);

  // use this return in prod!!
  return response;
}

export async function getContent(transcriptText) {
  const parsedData = transcriptText;

  const concatenatedContent = parsedData.data.contentJSON.cues
    .map((cue) => cue.content)
    .join(" ");

  // testing purpose, only limit to 200 words!
  const limitedContent = concatenatedContent
    .split(" ")
    .slice(0, 1000)
    .join(" ");
  return limitedContent;

  // use this return in prod!!
  // return concatenatedContent;
}
