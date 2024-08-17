import React from 'react';

const BackButton = ({ onNavigate }) => (
  <button className="back-button" onClick={() => onNavigate('home')}>
    <svg width="14" height="21" viewBox="0 0 14 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.455 1.32178L1 10.3226L12.455 19.3235" stroke="#6E6E6E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
);

export default BackButton;