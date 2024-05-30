//Evan with keyboard addition

import { useReducer, useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { ThemeProvider } from "@mui/material/styles";
import ChatMsg from "./chatmsg";
import {
  Button,
  TextField,
  Typography,
  AppBar,
  Toolbar,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import theme from "../theme";
import "../App.css";
import Rooms from "./rooms";
import UserMessagelist from "./usermessagelist";
import TopBar from "./topbar";
import ThreePRoundedIcon from "@mui/icons-material/ThreePRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
const ScenarioEnhanced = () => {
  const initialState = {
    messages: [],
    rooms: [],
    users: [],
    activeUsers: [],
    status: "",
    name: "",
    room: "",
    typingMsg: "",
    message: "",
    socket: null,
    isTyping: false,
    showjoinfields: true, //showSigninCard
    alreadyexists: false,
    open: false,
    joined: false,
    checkRooms: false,
  };

  //for the keyboard
  const inputRef = useRef(null);

  const reducer = (state, newState) => ({ ...state, ...newState });

  const onExists = (msg) => {
    setState({ alreadyexists: true });
  };
  const onRoomAndUserList = (dataFromServer) => {
    setState({
      rooms: dataFromServer.room,
      room: "",
      users: dataFromServer.from,
    });
  };

  const [state, setState] = useReducer(reducer, initialState);
  const focusTextInput = () => {
    inputRef.current.focus();
  };

  const onActiveRooms = (msg) => {
    setState({ rooms: msg });
  };
  // const onActiveUsers = (msg) => {
  //   if (msg !== null) setState({ users: msg });
  // };
  const onActiveUsers = (msg) => {
    if (msg !== null) setState({ activeUsers: msg });
  };
  const onNewMessage = (dataFromServer) => {
    addMessageToList(dataFromServer);
    setState({ typingMsg: "" });
  };

  const onTyping = (dataFromServer) => {
    if (dataFromServer.from !== state.name) {
      setState({
        typingMsg: msg.text,
      });
    }
  };
  const onWelcome = (dataFromServer) => {
    addMessageToList(dataFromServer);
    setState({ showjoinfields: false, exist: false });
  };

  const effectRan = useRef(false);

  //   const onExists = (msg) => {
  //     setState({ status: msg.text });
  //   };
  // generic handler for all other messages:
  const addMessageToList = (msg) => {
    let messages = state.messages;
    messages.push(msg);
    setState({
      messages: messages,
      users: msg.from,
      showjoinfields: false,
      alreadyexists: false,
    });
  };

  useEffect(() => {
    if (effectRan.current) return;
    serverConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const serverConnect = () => {
    // connect to server
    state.socket = io.connect("localhost:5000", {
      forceNew: true,
      transports: ["websocket"],
      autoConnect: true,
      reconnection: false,
      timeout: 5000,
    });

    state.socket.on("nameexists", onExists);
    state.socket.on("welcome", addMessageToList);
    state.socket.on("someonejoined", addMessageToList);
    state.socket.on("someoneleft", addMessageToList);
    state.socket.on("someoneistyping", onTyping);
    state.socket.on("newmessage", onNewMessage);

    state.socket.on("getrooms", onActiveRooms);
    state.socket.on("getusers", onActiveUsers);

    setState({ socket: state.socket });
  };

  // handler for join button click
  const handleJoin = () => {
    state.socket.emit("join", {
      name: state.name,
      room: state.room,
    });
  };
  // handler for name TextField entry
  const onNameChange = (e) => {
    setState({ name: e.target.value, status: "" });
  };
  // handler for room TextField entry
  const onRoomChange = (e) => {
    setState({ room: e.target.value });
  };

  // keypress handler for message TextField
  const onMessageChange = (e) => {
    setState({ message: e.target.value });
    if (state.isTyping === false) {
      state.socket.emit("typing", { from: state.name }, (err) => {});
      setState({ isTyping: true }); // flag first byte only
    }
  };

  // enter key handler to send message
  const handleSendMessage = (e) => {
    if (state.message !== "") {
      state.socket.emit(
        "message",
        { from: state.name, text: state.message },
        (err) => {}
      );
      setState({ isTyping: false, message: "" });
    }
  };

  const [open, setOpen] = useState(false);
  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const selectRoom = (e, value) => {
    setState({ room: value });
  };

  //Line 184 and 185 remove one because only one can exist or add text in the handlers
  return (
    <ThemeProvider theme={theme}>
      <Card style={{ marginTop: "5vh" }}>
        <TopBar viewDialog={handleOpenDialog} show={state.showjoinfields} />
        <Dialog open={open} onClose={handleCloseDialog} style={{ margin: 20 }}>
          <DialogTitle color="primary" style={{ textAlign: "center" }}>
            Who's online?
          </DialogTitle>
          <DialogContent>
            {state.activeUsers.map((e, index) => {
              return (
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  key={index}
                >
                  <ThreePRoundedIcon sx={{ color: `${e.color}` }} />
                  <p style={{ margin: "5px" }}>
                    {e.name} is in room {e.room}
                  </p>
                </div>
              );
            })}
          </DialogContent>
        </Dialog>
        <p></p>
        {state.showjoinfields && (
          <div style={{ padding: "3vw", margin: "3vw" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ForumRoundedIcon
                style={{ color: "black", height: 70, width: 70 }}
              />
            </div>
            <Typography
              color="primary"
              style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }}
            >
              Sign in
            </Typography>

            <TextField
              onChange={onNameChange}
              placeholder="Enter unique name"
              autoFocus={true}
              required
              value={state.name}
              error={state.status !== ""}
              helperText={state.status}
            />
            <p></p>
            <Rooms rooms={state.rooms} setroom={selectRoom} />
            <TextField
              onChange={onRoomChange}
              placeholder="Enter room name"
              required
              value={state.room}
            />
            <p></p>
            <Button
              variant="contained"
              data-testid="submit"
              color="primary"
              style={{ marginLeft: "3%" }}
              onClick={() => handleJoin()}
              disabled={state.name === "" || state.room === ""}
            >
              Join
            </Button>
          </div>
        )}
        {!state.showjoinfields && (
          <div className="usersList">
            <UserMessagelist
              message={state.message}
              name={state.name}
              room={state.room}
            />
          </div>
        )}
        {!state.showjoinfields && (
          <TextField
            style={{ marginLeft: "3vw", width: "90vw  " }}
            onChange={onMessageChange}
            placeholder="type something here"
            autoFocus={true}
            value={state.message}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
                e.target.blur();
              }
            }}
          />
        )}
        {!state.showjoinfields && (
          <div
            style={{ marginTop: "3vh", marginLeft: "2vw", fontWeight: "bold" }}
          >
            Current Messages
          </div>
        )}

        <div className="scenario-container">
          Messages
          {state.messages.map((message, index) => (
            <ChatMsg msg={message} key={index} />
          ))}
        </div>

        <div>
          <Typography color="secondary">{state.typingMsg}</Typography>
        </div>
      </Card>
    </ThemeProvider>
  );
};
export default ScenarioEnhanced;
