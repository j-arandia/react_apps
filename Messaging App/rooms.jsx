import React from "react";
import { RadioGroup, FormControlLabel, FormControl } from "@mui/material";
import Radio from "@mui/material/Radio";
import { Typography } from "@mui/material";
const Rooms = (props) => {
  return (
    <div>
      <Typography color="primary">Join Existing or Enter Room Name</Typography>
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
          onChange={props.setroom}
        >
          <FormControlLabel value="main" control={<Radio />} label="main" />
          {props.rooms.map((room, index) => {
            if (room !== "main")
              return (
                <FormControlLabel
                  value={room}
                  control={<Radio />}
                  label={room}
                  key={index}
                />
              );
            else {
              return null;
            }
          })}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default Rooms;
