import React from "react";
import HeaderBase from "../components/HeaderBase";
import { ReactComponent as AwardIcon } from "../assets/award.svg";
import { ReactComponent as NoteIcon } from "../assets/note.svg";
import { ReactComponent as MadeLove } from "../assets/madelove.svg";
import { ReactComponent as Product } from "../assets/product.svg";
import ButtonWithLogo from "../components/ButtonWithLogo";

const HomeScreen = ({ onNavigate }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "90vh",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%" }}>
        <HeaderBase />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          textAlign: "center",
          flexGrow: 1,
        }}
      >
        <Product/>
        <h3
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            color: "#6B6B6B",
          }}
        >
          What type of learning resources are you looking for today?
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            padding: "0 20px",
            boxSizing: "border-box",
            gap: 10,
          }}
        >
          <ButtonWithLogo
            text="Quizzes"
            color="#D5016C"
            icon={AwardIcon}
            onClick={() => onNavigate("quiz")}
            fullWidth={true}
          />

          <ButtonWithLogo
            text="Lecture Notes"
            color="#90268E"
            icon={NoteIcon}
            onClick={() => onNavigate("notes")}
            fullWidth={true}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        <MadeLove />
      </div>
    </div>
  );
};

export default HomeScreen;
