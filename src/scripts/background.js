/* global chrome */

let lectureData = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'LECTURE_DATA') {
    console.log('Received lecture data:', message);
    lectureData = message;
    chrome.runtime.sendMessage(message);
  } else if (message.action === 'GET_TRANSCRIPT') {
    if (lectureData && lectureData.mediaId && lectureData.lessonId) {
      fetchTranscript(lectureData.mediaId, lectureData.lessonId).then(sendResponse);
      return true;
    } else {
      sendResponse({error: 'Lecture data not found. Please ensure you\'re on an Echo360 lecture page and refresh if necessary.'});
    }
  }
});

async function fetchTranscript(mediaId, lessonId) {
  try {
    const url = `https://echo360.net.au/api/ui/echoplayer/lessons/${lessonId}/medias/${mediaId}/transcript`;
    const cookies = await getCookies();
    const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'Cookie': cookieString
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("This is data", data);
    return data;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return {error: error.message};
  }
}

function getCookies() {
  return new Promise((resolve) => {
    chrome.cookies.getAll({domain: "echo360.net.au"}, (cookies) => {
      resolve(cookies);
    });
  });
}