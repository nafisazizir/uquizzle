/* global chrome */
import React from 'react';
import ReactDOM from 'react-dom';

const ContentScript = () => {
  React.useEffect(() => {
    const interceptLectureData = () => {
      const script = document.createElement('script');
      script.textContent = `
        (function() {
          const originalLog = console.log;
          console.log = function(...args) {
            if (args[0] === "EchoPlayerV2Full props" && args[1] && args[1].video && args[1].video.mediaId) {
              window.postMessage({
                type: 'LECTURE_DATA',
                mediaId: args[1].video.mediaId,
                lessonId: args[1].context.lessonId,
                title: args[1].title
              }, '*');
            }
            originalLog.apply(console, arguments);
          };
        })();
      `;
      document.documentElement.appendChild(script);
      script.remove();
    };

    interceptLectureData();

    const handleMessage = (event) => {
      if (event.data && event.data.type === 'LECTURE_DATA') {
        chrome.runtime.sendMessage({
          action: 'LECTURE_DATA',
          mediaId: event.data.mediaId,
          lessonId: event.data.lessonId,
          title: event.data.title
        });
      }
    };

    window.addEventListener('message', handleMessage);


    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return null;
};

const root = document.createElement('div');
root.id = 'echo360-transcriber-root';
document.body.appendChild(root);

ReactDOM.render(<ContentScript />, root);