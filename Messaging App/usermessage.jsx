import { useEffect, useRef } from "react";
import { ListItem } from "@mui/material";
import ChatMsg from "./chatmsg";
import Triangle from "./triangle";
const UserMessage = (props) => {
  const userRef = useRef(null);
  useEffect(() => {
    userRef.current.scrollIntoView(true);
  }, []);

  return (
    <div
      style={{
        float: props.user === props.msg.from ? "right" : "left",
        clear: "both",
        marginBottom: "15px",
        width: "70%",
      }}
    >
      <ListItem
        ref={userRef}
        style={{ textAlign: "left", marginBottom: "2vh" }}
      >
        <ChatMsg
          message={props.message}
          name={props.name}
          color={props.message.color}
        />
        <Triangle color={props.message.color} alignTriangle={triangleAlign} />
      </ListItem>
      <p></p>
    </div>
  );
};
export default UserMessage;
