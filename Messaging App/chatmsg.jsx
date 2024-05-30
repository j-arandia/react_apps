import React from "react";
import "../App.css";
const ChatMsg = (props) => {
  return (
    <div
      className="scenario-message"
      style={{ backgroundColor: props.msg.color }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>{props.msg.from} says</div>
        <div>
          Room: {props.msg.room}
          <br />@{props.msg.time}
        </div>
      </div>
      <p style={{ fontSize: 14, fontWeight: "700" }}>{props.msg.text}</p>
    </div>
  );
};
export default ChatMsg;
