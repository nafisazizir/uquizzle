import React from 'react';
import './SidebarBase.css';

const SidebarBase = ({ children }) => {
  return (
    <div className="sidebar-base">
      {children}
    </div>
  );
};

export default SidebarBase;