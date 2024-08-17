import React from 'react';
import './HeaderBase.css';
import { ReactComponent as Icon } from '../../assets/header.svg'; 

const HeaderBase = () => {
  return (
    <div className="header-base">
      <Icon />
    </div>
  );
};

export default HeaderBase;