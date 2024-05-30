import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { Card, CardHeader, Typography, CardContent } from "@mui/material";
import "../App.css";
import MenuIcon from "@mui/icons-material/Menu";
import { height } from "@mui/system";
import logo from "../project1/pics/TravelAlert.png";

const CaseStudyComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <br />
      <Card>
        <CardHeader
          title="World Wide"
          variant="h6"
          style={{
            textAlign: "center",
            color: "#863434",
            paddingTop: 50,
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 0,
          }}
        />
        <br />

        <img height={150} width={150} src={logo} alt="travelalertslogo" />
        <CardContent>
          <div>
            <Typography
              variant="body2"
              color="secondary"
              style={{
                textAlign: "end",
                paddingRight: "1vh",
                fontSize: "smaller",
              }}
            >
              &copy;INFO3139 - 2023
            </Typography>
          </div>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default CaseStudyComponent;
