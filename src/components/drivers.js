import React, { useContext, useEffect, useState } from "react";
import {
Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Hidden,
  IconButton,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { EditOutlined, VisibilityOutlined, DeleteOutline } from "@material-ui/icons";
import { format } from "date-fns";
import Loader from "./loader";
import Firebase from "../lib/firebase";
import { SnackbarContext } from "../App";

const Drivers = () => {
  const date = format(new Date(), "dd-MM-yyyy");

  const [drivers, setDrivers] = useState([]);
  const [driversFetched, setDriversFetched] = useState(false);
  const { snackbar, setSnackbar } = useContext(SnackbarContext);

  useEffect(() => {
    (async () => {
      let drivers = Firebase.getAllRefs("drivers");
      let driverApplications = Firebase.getAllRefs("driverApplications");
      drivers = drivers.map(driver => {
        driverApplications.forEach(application => {
          if (application.id == driver.id) {
            driver ={...application, ...driver}
          }
        })
        return driver
      })
      setDrivers(drivers);
      setDriversFetched(true);
    })();
  }, [snackbar]);

  const deactivateDriver = (driverId) => {
    (async () => {
      try {
        await Firebase.updateRef(`driverApplications/${driverId}`, {status: "pending"})
        setSnackbar({open:true, message: "Driver has been deactivated successfully", color:"success"})
      } catch (error) {
        console.error(error)
        setSnackbar({open:true, message: "An error occured while trying to deactivate the driver", color:"error"})
      }
    })()
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Drivers
        </Typography>
        <TableContainer>
            <Table>
              <TableHead>
                <TableRow style={{ fontFamily: "Lato", fontWeight: "bolder" }}>
                  <TableCell>Driver</TableCell>
                  <Hidden xsDown>
                    <TableCell align="center">Email</TableCell>
                  </Hidden>
                  <Hidden xsDown>
                    <TableCell align="center">Phone</TableCell>
                  </Hidden>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {drivers.length < 1 && (
                  <TableRow>
                    <TableCell align="center" colSpan={4}>
                      You don't have any drivers yet
                    </TableCell>
                  </TableRow>
                )}
                {drivers.length > 0 &&
                  drivers.map((driver, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Grid container direction="row" alignItems="center">
                          <Avatar style={{ marginRight: "1em" }}>
                            {driver.fullname[0]}
                          </Avatar>
                          <Typography>{driver.fullname}</Typography>
                        </Grid>
                      </TableCell>
                      <Hidden xsDown>
                        <TableCell align="center">
                          {driver.email}
                        </TableCell>
                      </Hidden>
                      <Hidden xsDown>
                        <TableCell align="center">
                          {driver.phone}
                        </TableCell>
                      </Hidden>
                      <TableCell align="center">
                        {(driver.status == "approved" || driver.status == undefined) && (
                        <Button variant="contained" color="primary" onClick={e => deactivateDriver(driver.id)} size="lg">
                            Deactivate
                        </Button>
                        )}
                        {driver.status == "pending" && (
                        <Button variant="contained" color="primary" disabled={true} onClick={e => deactivateDriver(driver.id)} size="lg">
                            Deactivate
                        </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
      </CardContent>
    </Card>
  );
};

export default Drivers;