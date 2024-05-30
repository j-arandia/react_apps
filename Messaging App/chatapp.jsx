import { useReducer, useEffect } from "react";
import io from "socket.io-client";
import { ThemeProvider, Card, CardContent } from "@mui/material";
import theme from "../theme";
import HeaderBar from "./Header";
import SignIn from "./signin";
import ChatMessage from "./message";

const ChatApp = () => {
  const initialState = {
    messages: [],
    status: "",
    showjoinfields: true,
    chatName: "",
    roomName: "",
    typingMsg: "",
    isTyping: false,
    users: [],
    rooms: [],
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  useEffect(() => {
    serverConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const serverConnect = () => {
    // connect to server
    // const socket = io.connect("localhost:5000", {
    //   forceNew: true,
    //   transports: ["websocket"],
    //   autoConnect: true,
    //   reconnection: false,
    //   timeout: 5000,
    // });
    const socket = io.connect();
    socket.on("nameexists", onExists);
    socket.on("welcome", addMessage);
    socket.on("someonejoined", addMessage);
    socket.on("someoneleft", addMessage);
    socket.on("someoneistyping", onTyping);
    socket.on("newmessage", onNewMessage);
    socket.on("getusers", onGetUsers);
    socket.on("currentrooms", onLoadRooms);

    socket.emit("fetchRooms");
    setState({ socket: socket });
  };
  const onExists = (dataFromServer) => {
    setState({ status: dataFromServer.text });
  };

  const addMessage = (dataFromServer) => {
    let messages = state.messages;
    messages.push(dataFromServer);
    setState({
      messages: messages,
      showjoinfields: false,
    });
  };

  const onNewMessage = (dataFromServer) => {
    addMessage(dataFromServer);
    setState({ typingMsg: "" });
  };

  const onTyping = (dataFromServer) => {
    if (dataFromServer.from !== state.chatName) {
      setState({
        typingMsg: dataFromServer.text,
      });
    }
  };

  const onLoadRooms = (dataFromServer) => {
    let rooms = [];
    rooms.push("Main");
    dataFromServer.rooms.forEach((room) => {
      rooms.push(room);
    });
    rooms = [...new Set(rooms)];
    setState({ rooms: rooms });
  };

  const onGetUsers = (dataFromServer) => {
    let userlist = [];

    dataFromServer.users.forEach((user) => {
      userlist.push({ text: user.text, colour: user.colour });
    });

    setState({ users: userlist });
  };

  const handleJoin = () => {
    state.socket.emit("join", {
      chatName: state.chatName,
      roomName: state.roomName,
    });
  };

  const onNameChange = (e) => {
    setState({ chatName: e });
  };

  const onRoomChange = (e) => {
    setState({ roomName: e });
  };

  return (
    <ThemeProvider theme={theme}>
      <HeaderBar users={state.users} />
      {state.showjoinfields && (
        <SignIn
          join={handleJoin}
          setName={onNameChange}
          setRoom={onRoomChange}
          status={state.status}
          rooms={state.rooms}
        />
      )}
      {!state.showjoinfields && (
        <ChatMessage
          socket={state.socket}
          messages={state.messages}
          chatName={state.chatName}
          typingMsg={state.typingMsg}
        />
      )}
    </ThemeProvider>
  );
};
export default ChatApp;
