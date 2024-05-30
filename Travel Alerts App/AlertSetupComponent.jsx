import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

import HomePage from "./project1component";

import {
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

const AlertSetupComponent = (props) => {
  const initialState = {
    gotData: false,
    resultsArr: [],
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const handleSnackbar = (data) => {
    props.dataFromAlert(data);
  };
  //const GRAPHURL = "http://localhost:5000/graphql";
  const GRAPHURL = "/graphql";
  let myHeaders = { "Content-Type": "application/json; charset=utf-8" };
  const fetchAlerts = async () => {
    try {
      setState({ gotData: true });

      handleSnackbar("running setup...");

      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          query: "query {project1_setup{results}}",
        }),
      });

      let json = await response.json();
      // return the JSON to a variable called payload, then
      //let payload = [];
      let payload = json.data.project1_setup.results
        .replace(/([.])\s*(?=[A-Z])/g, "$1|")
        .split("|");

      setState({ resultsArr: payload });
      handleSnackbar("alerts collection setup completed");
    } catch (error) {
      console.log(error);
      handleSnackbar(`Problem inside fetchAlert - ${error.message}`);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <HomePage />
        <Typography
          variant="h6"
          style={{
            textAlign: "center",
            fontFamily: "sans-serif",
            fontWeight: "bold",
            color: "#024E47",
          }}
        >
          Alert Setup - Details
        </Typography>
        <br />
        <TableContainer>
          <Table>
            <TableBody>
              {state.resultsArr.map((res, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="res">
                    <Typography color="secondary">{res}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </ThemeProvider>
  );
};
export default AlertSetupComponent;
