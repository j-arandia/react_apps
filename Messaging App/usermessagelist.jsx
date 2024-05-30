import { List } from "@mui/material";
import User from "./usermessage";
const UserList = (props) => {
  let messages = props.message.map((e, idx) => {
    return <User key={idx} message={e} name={props.name} />;
  });
  return <List>{messages}</List>;
};
export default UserList;
