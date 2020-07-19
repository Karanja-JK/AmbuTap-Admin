import React from "react";
import { Route, Link, useHistory, useLocation } from "react-router-dom";
import {
  Avatar,
  Box,
  Container,
  Grid,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Landing from "./landing";
import Navbar from "./navbar";
import NavItems from "./navitems";
import DriverApplications from "./applications"
import Drivers from "./drivers"
import Users from "./users"
import Firebase from "../lib/firebase";


const useStyles = makeStyles(theme => ({
  root: {
    minHeight: "100vh"
  },
  sideNav: {
    background: "rgba(255,61,0,0.05)"
  },
  sideNavImg: {
    borderRadius: "100%",
    height: "5em"
  },
  sideNavContainer: {
    height: "100%",
    maxWidth: "25%",
    position: "fixed"
  },
  listItem: {
    color: "#FAFAFA"
  },
  listItemIcon: {
    color: "#FAFAFA"
  },
  main: {
    background: "#FFF"
  }
}));

const dashboardPages = [
  { name: "Summary", link: "/", regex: new RegExp("^/$") },
  {
    name: "Employees",
    link: "/employees/",
    regex: new RegExp("^/employees$")
  },
  {
    name: "Services",
    link: "/services/",
    regex: new RegExp("^/services$")
  }
];

const Dashboard = () => {
  const classes = useStyles();

  const history = useHistory();
  const location = useLocation();

  if (!Firebase.getCurrentUser()) {
    // not logged in
    console.error("Please login first");
    history.replace("/login");
    return null;
  }

  return (
    <>
      <Grid container className={classes.root}>
        <Navbar />
        <Hidden smDown>
          <Grid item className={classes.sideNav} md={3}>
            <Grid
              container
              alignItems="center"
              justify="center"
              className={classes.sideNavContainer}
            >
              <Grid item md={8}>
                <Grid container justify="center">
                  <img
                    src="/ambutaplogo.png"
                    className={classes.sideNavImg}
                    alt="logo"
                  />
                </Grid>
                <Box mt="2em">
                  <List>
                    <NavItems/>
                  </List>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Hidden>
        <Grid item xs={12} md={9} className={classes.main}>
          <Box mt="5.5em">
            <Container>
              <Route path="/" exact component={Landing} />
              <Route path="/driverapplications" exact component={DriverApplications} />
              <Route path="/drivers" exact component={Drivers} />
              <Route path="/users" exact component={Users}/>
            </Container>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;