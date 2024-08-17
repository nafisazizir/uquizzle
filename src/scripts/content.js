/* global chrome */
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import '../content.css';

const injectSidebar = () => {
  const sidebarRoot = document.createElement('div');
  sidebarRoot.id = 'echo360-transcriber-sidebar';
  document.body.appendChild(sidebarRoot);

  const toggleButton = document.createElement('button');
  toggleButton.id = 'echo360-transcriber-toggle';
  toggleButton.textContent = 'Minimize';
  toggleButton.style.top = '10px';
  toggleButton.style.right = '310px';

  toggleButton.onclick = (e) => {
    if (!isDragging) {
      const sidebar = document.getElementById('echo360-transcriber-sidebar');
      const body = document.body;
      sidebar.classList.toggle('minimized');
      toggleButton.classList.toggle('minimized');
      body.classList.toggle('sidebar-open');
      toggleButton.textContent = sidebar.classList.contains('minimized') ? 'Expand' : 'Minimize';
    }
  };

  let isDragging = false;
  let dragStartX, dragStartY;
  let buttonStartX, buttonStartY;

  const startDragging = (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    const rect = toggleButton.getBoundingClientRect();
    buttonStartX = rect.left;
    buttonStartY = rect.top;
    toggleButton.style.transition = 'none';
  };

  const stopDragging = () => {
    isDragging = false;
    toggleButton.style.transition = '';
  };

  const drag = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;
    
    const newLeft = buttonStartX + deltaX;
    const newTop = buttonStartY + deltaY;
    
    const maxX = window.innerWidth - toggleButton.offsetWidth;
    const maxY = window.innerHeight - toggleButton.offsetHeight;
    
    toggleButton.style.left = `${Math.max(0, Math.min(newLeft, maxX))}px`;
    toggleButton.style.top = `${Math.max(0, Math.min(newTop, maxY))}px`;
    toggleButton.style.right = 'auto';
  };

  toggleButton.addEventListener('mousedown', startDragging);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDragging);
  toggleButton.addEventListener('dragstart', (e) => e.preventDefault());

  document.body.appendChild(toggleButton);

  ReactDOM.render(<App />, sidebarRoot);
};

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
injectSidebar();

window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'LECTURE_DATA') {
    chrome.runtime.sendMessage({
      action: 'LECTURE_DATA',
      mediaId: event.data.mediaId,
      lessonId: event.data.lessonId,
      title: event.data.title
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'JUMP_TIMESTAMP') {
    const video = document.querySelector('video');
    const progressBar = document.querySelector('#timeline-progress-bar');

    if (video && progressBar) {
      const totalDuration = video.duration * 1000;
      const timestamp = message.timestamp; 

      const percentage = (timestamp / totalDuration) * 100;
      console.log(totalDuration, timestamp, percentage)

      const progressBarRect = progressBar.getBoundingClientRect();
      console.log(progressBarRect.left, progressBarRect.right, progressBarRect.width);
      const clickPositionX = progressBarRect.left + (percentage / 100) * (progressBarRect.width);

      const clickEvent = new MouseEvent('click', {
        clientX: clickPositionX,
        clientY: progressBarRect.top + (progressBarRect.height / 2),
        bubbles: true,
        cancelable: true,
      });

      progressBar.dispatchEvent(clickEvent);

      sendResponse({ success: true });
    } else {
      sendResponse({ error: 'Video player or timeline controls not found.' });
    }
  }
});