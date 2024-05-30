import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import HomePage from "./project1component";
import {
  Card,
  Typography,
  TextField,
  CardContent,
  Button,
  Grid,
  Box,
  Autocomplete,
} from "@mui/material";

const AdvisoryAddComponent = (props) => {
  const initialState = {
    msg: "",
    countrynames: [],
    name: "",
    country: "",
    alert: "",
    date: "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const handleSnackbar = (data) => {
    props.dataFromAlert(data);
  };
  //const GRAPHURL = "http://localhost:5000/graphql";
  const GRAPHURL = "/graphql";
  let myHeaders = { "Content-Type": "application/json; charset=utf-8" };
  //retrieving all country names for the autocomplete
  const fetchCountryNames = async () => {
    try {
      handleSnackbar("Loading alerts from server..");

      let query = JSON.stringify({
        query: `query {alerts{name}}`,
      });

      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: myHeaders,
        body: query,
      });

      let json = await response.json();
      let payload = json.data.alerts.map((item) => item.name).sort();

      handleSnackbar("alerts data loaded");

      setState({
        countrynames: payload,
      });
    } catch (error) {
      console.log(error);
    }
  }; //end fetchCountryNames

  useEffect(() => {
    fetchCountryNames();
  }, []);

  const handleNameInput = (e) => {
    setState({ name: e.target.value });
  };

  const onChange = (e, selectedOption) => {
    selectedOption
      ? setState({ country: selectedOption })
      : setState({ msg: "" });
  };
  //retrieving alert text from the chosen country
  const fetchAlert = async (country) => {
    try {
      let query = JSON.stringify({
        query: `query {searchalert(name: "${country}") {text}}`,
      });

      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: myHeaders,
        body: query,
      });
      let json = await response.json();
      const timestamp = new Date();
      setState({ alert: json.data.searchalert.text, date: timestamp });
    } catch (error) {
      console.log(error);
      handleSnackbar(`Problem inside fetchAlert - ${error.message}`);
    }
  };

  //mutation with the traveler's name, current timestamp
  const addTravelerData = async () => {
    try {
      let query = JSON.stringify({
        query: `mutation($name: String, $country: String, $text: String, $date: String) {addtraveler(name: $name, country: $country, text: $text, date: $date) {name, country, text, date }}`,
        variables: {
          name: state.name,
          country: state.country,
          text: state.alert,
          date: state.date,
        },
      });

      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: myHeaders,
        body: query,
      });
      let json = await response.json();

      handleSnackbar(`added advisory on ${json.data.addtraveler.date}`);
    } catch (error) {
      console.log(error);
      handleSnackbar(`Problem inside addTravelerData - ${error.message}`);
    }
  };

  const onAddClicked = async () => {
    addTravelerData();
  };

  useEffect(() => {
    fetchAlert(state.country);
  }, [onAddClicked]);

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <HomePage />
        <Typography
          variant="h6"
          color="inherit"
          style={{ textAlign: "center", fontWeight: "bold", color: "#024E47" }}
        >
          Add Advisory
        </Typography>
        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1, width: "20ch" } }}
          noValidate
          autoComplete="off"
        >
          <TextField
            value={state.name}
            placeholder="Traveler's Name"
            onChange={handleNameInput}
          />
        </Box>
        <CardContent>
          <Autocomplete
            options={state.countrynames}
            getOptionLabel={(option) => option}
            style={{ width: 300 }}
            onChange={onChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Countries"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <p />
          <div>
            <Typography color="primary">{state.msg}</Typography>
          </div>
        </CardContent>
        <div>
          <Grid container justifyContent="center">
            <Button
              color="primary"
              variant="contained"
              onClick={() => onAddClicked()}
            >
              ADD ADVISORY
            </Button>
          </Grid>
        </div>
      </Card>
    </ThemeProvider>
  );
};

export default AdvisoryAddComponent;
