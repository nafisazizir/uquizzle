/* global chrome */
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import '../content.css';

const logo = `<svg width="29" height="26" viewBox="0 0 29 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="14.7638" cy="11.4177" r="9.62029" fill="#D5016C"/>
<circle cx="14.8591" cy="11.5127" r="7.81053" fill="#AF0159"/>
<circle cx="14.859" cy="11.5125" r="6.09602" fill="#90268E"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.01645 0C3.55462 1.29255 2.36168 2.86037 1.50576 4.61395C0.649836 6.36753 0.147689 8.27253 0.0279857 10.2202C-0.0917171 12.1678 0.173369 14.12 0.80811 15.9652C1.44285 17.8104 2.43481 19.5125 3.72736 20.9743C5.01991 22.4361 6.58774 23.6291 8.34132 24.485C10.0949 25.3409 11.9999 25.8431 13.9475 25.9628C15.8952 26.0825 17.8473 25.8174 19.6925 25.1826C21.4012 24.5949 22.9872 23.7008 24.3733 22.5453L22.706 20.878C21.5785 21.7858 20.3008 22.492 18.9293 22.9638C17.3754 23.4983 15.7316 23.7215 14.0915 23.6207C12.4514 23.5199 10.8472 23.0971 9.37057 22.3763C7.8939 21.6556 6.57366 20.651 5.48522 19.42C4.39678 18.189 3.56147 16.7557 3.02696 15.2019C2.49245 13.6481 2.26923 12.0042 2.37003 10.3641C2.47083 8.72403 2.89368 7.11987 3.61444 5.6432C4.3352 4.16654 5.33975 2.8463 6.57074 1.75786L5.01645 0Z" fill="#231F20"/>
<path d="M23.4463 20.0854L27.2416 23.7203" stroke="#AF0159" stroke-width="2.28601"/>
</svg>
`

const injectSidebar = () => {
  const sidebarRoot = document.createElement('div');
  sidebarRoot.id = 'echo360-transcriber-sidebar';
  document.body.appendChild(sidebarRoot);

  const toggleButton = document.createElement('button');
  toggleButton.id = 'echo360-transcriber-toggle';
  toggleButton.innerHTML = logo;
  toggleButton.style.top = '10px';
  toggleButton.style.right = '310px';

  toggleButton.onclick = (e) => {
    if (!isDragging) {
      const sidebar = document.getElementById('echo360-transcriber-sidebar');
      const body = document.body;
      sidebar.classList.toggle('minimized');
      toggleButton.classList.toggle('minimized');
      body.classList.toggle('sidebar-open');
      // Remove this line as it's overwriting the SVG
      // toggleButton.textContent = sidebar.classList.contains('minimized') ? 'Expand' : 'Minimize';
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