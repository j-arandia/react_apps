import PersonPinRoundedIcon from "@mui/icons-material/PersonPinRounded";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
const TopBar = (props) => {
  const onIconClicked = () => props.viewDialog(); // notify the parent
  return (
    <AppBar>
      <Toolbar color="primary">
        <Typography variant="h6" color="inherit">
          Chat Up! - INFO3139
        </Typography>
        {!props.show && (
          <section style={{ height: 90, width: 90, marginLeft: "auto" }}>
            <IconButton onClick={onIconClicked}>
              <PersonPinRoundedIcon
                style={{ color: "black", height: 70, width: 70 }}
              />
            </IconButton>
          </section>
        )}
      </Toolbar>
    </AppBar>
  );
};
export default TopBar;
