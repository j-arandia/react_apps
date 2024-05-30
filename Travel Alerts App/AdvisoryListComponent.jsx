import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import "../App.css";
import HomePage from "./project1component";
import {
  Card,
  Typography,
  CardContent,
  TextField,
  Autocomplete,
  FormControlLabel,
  Radio,
  RadioGroup,
  TableHead,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

const AdvisoryListComponent = (props) => {
  const initialState = {
    snackbarMsg: "",
    selection: "",
    alertsDataForTable: [],
    allDataForAuto: [],
    travelers: [],
    selectedRadioBtn: "",
    gotData: false,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  //snackbar
  const handleSnackbar = (data) => {
    props.dataFromAlert(data);
  };

  //const GRAPHURL = "http://localhost:5000/graphql";
  const GRAPHURL = "/graphql";
  let myHeaders = { "Content-Type": "application/json; charset=utf-8" };

  useEffect(() => {
    fetchTravelers();
  }, []);

  //This will return all the travelers in the travelers collection
  const fetchTravelers = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          query: `query{travelers{name, country, text, date}}`,
        }),
      });
      let json = await response.json();

      setState({
        travelers: json.data.travelers,
        gotData: true,
      });
      handleSnackbar(`found ${json.data.travelers.length} travelers`);
    } catch (error) {
      console.log(error);
      handleSnackbar(`Problem inside fetchTravelers - ${error.message}`);
    }
  };

  const fetchRegion = async () => {
    try {
      setState({ gotData: true });
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          query: "query {regions}",
        }),
      });
      let json = await response.json();
      //let payload = json.data.regions;

      handleSnackbar(`found ${json.data.regions.length} regions`);

      setState({ allDataForAuto: json.data.regions, gotData: true });
    } catch (error) {
      console.log(error);
      handleSnackbar(`Problem inside fetchRegion - ${error.message}`);
    }
  };

  const fetchSubRegion = async () => {
    try {
      setState({ gotData: true });
      let query = JSON.stringify({
        query: `query {subregions}`,
      });
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: myHeaders,
        body: query,
      });

      let json = await response.json();
      let payload = json.data.subregions;

      setState({ allDataForAuto: payload });
      handleSnackbar(`found ${payload.length} subregions`);
    } catch (error) {
      console.log(error);
      handleSnackbar(`Problem inside fetchSubRegion - ${error.message}`);
    }
  };

  const fetchAlertsByRegion = async (value) => {
    try {
      setState({ gotData: true });

      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          query: `query {alertsforregion(region: "${value}"){name, text,date}}`,
        }),
      });
      let json = await response.json();

      let payload = json.data.alertsforregion;

      handleSnackbar(`found ${payload.length} alerts for ${value}`);

      return payload;
    } catch (error) {
      console.log(error);
      handleSnackbar(`Problem inside fetchAlertsByRegion - ${error.message}`);
    }
  };

  const fetchAlertsBySubRegion = async (value) => {
    try {
      setState({ gotData: true });
      let query = JSON.stringify({
        query: `query {alertsforsubregion(subregion: "${value}"){name, text, date}}`,
      });
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: myHeaders,
        body: query,
      });
      let json = await response.json();
      let payload = json.data.alertsforsubregion;

      handleSnackbar(`found ${payload.length} alerts for ${value}`);

      return payload;
    } catch (error) {
      console.log(error);
      handleSnackbar(
        `Problem inside fetchAlertsBySubRegion - ${error.message}`
      );
    }
  };

  const onChangeAuto = async (e, selectedOption) => {
    selectedOption
      ? setState({ selection: `${selectedOption}` })
      : setState({ selection: `` });

    if (selectedOption !== null) {
      if (state.selectedRadioBtn === "Traveler") {
        let advisoryList = state.travelers.filter(
          (item) => item.name === selectedOption
        );
        advisoryList = advisoryList.map((val) => {
          return {
            country: val.country,
            text: `${val.text}`,
            date: `${val.date}`,
          };
        });
        setState({ alertsDataForTable: advisoryList });
      } else if (state.selectedRadioBtn === "Regions") {
        let regAlerts = await fetchAlertsByRegion(selectedOption);
        regAlerts = regAlerts.map((reg) => {
          return {
            country: reg.name,
            text: `${reg.text}`,
            date: `${reg.date}`,
          };
        });
        setState({ alertsDataForTable: regAlerts });
      } else if (state.selectedRadioBtn === "SubRegions") {
        let subregAlerts = await fetchAlertsBySubRegion(selectedOption);
        subregAlerts = subregAlerts.map((subreg) => {
          return {
            country: subreg.name,
            text: `${subreg.text}`,
            date: `${subreg.date}`,
          };
        });
        setState({ alertsDataForTable: subregAlerts });
      }
    }
  };

  const onClickBtn = (event) => {
    setState({
      selectedRadioBtn: event.target.value,
    });
    if (event.target.value === "Traveler") {
      fetchTravelers();
      let trvlrs = state.travelers.map((val) => {
        return val["name"];
      });
      trvlrs = [...new Set(trvlrs)];
      setState({ allDataForAuto: trvlrs });
    } else if (event.target.value === "Regions") {
      fetchRegion();
    } else if (event.target.value === "SubRegions") {
      fetchSubRegion();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <HomePage />
        <CardContent
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            color="primary"
            style={{ fontSize: "20px", fontWeight: "bold", color: "#024E47" }}
          >
            List Advisories By:
          </Typography>

          <RadioGroup
            row
            name="radBtnsGroup"
            value={state.selectedRadioBtn}
            onChange={onClickBtn}
          >
            <FormControlLabel
              value="Traveler"
              control={<Radio />}
              label="Traveler"
            />
            <FormControlLabel
              value="Regions"
              control={<Radio />}
              label="Regions"
            />
            <FormControlLabel
              value="SubRegions"
              control={<Radio />}
              label="SubRegions"
            />
          </RadioGroup>

          <Autocomplete
            options={state.allDataForAuto}
            getOptionLabel={(option) => option}
            style={{ width: 300 }}
            onChange={onChangeAuto}
            renderInput={(params) => (
              <TextField
                {...params}
                label={state.selectedRadioBtn}
                variant="outlined"
                fullWidth
              />
            )}
          />

          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography color="primary" style={{ fontWeight: "bold" }}>
                      Country
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="primary" style={{ fontWeight: "bold" }}>
                      Alert Information
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.alertsDataForTable.map((item) => (
                  <TableRow
                    key={item.date + " " + item.text + " " + item.country}
                  >
                    <TableCell component="th" scope="item">
                      <Typography color="secondary">{item.country}</Typography>
                    </TableCell>
                    <TableCell component="th" scope="item">
                      <Typography color="secondary">
                        {item.text}
                        <br />
                        {item.date}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default AdvisoryListComponent;
