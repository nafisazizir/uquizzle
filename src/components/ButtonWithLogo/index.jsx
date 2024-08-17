import React from "react";
import "./ButtonWithLogo.css";

const ButtonWithLogo = ({ text, color, icon: Icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="custom-button"
      style={{
        backgroundColor: color,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 3,
        }}
      >
        {text}
        {Icon && <Icon style={{ marginRight: "8px" }} />}
      </div>
    </button>
  );
};

export default ButtonWithLogo;
