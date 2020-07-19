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



const DriverApplications = () => {
  const date = format(new Date(), "dd-MM-yyyy");

  const [applications, setApplications] = useState([]);
  const [applicationsFetched, setApplicationsFetched] = useState(false);
  const { snackbar, setSnackbar } = useContext(SnackbarContext);

  

  useEffect(() => {
    (async () => {
      let applications = await Firebase.getRefsByAttribute("driverApplications", "status", "pending");
      applications = applications.map(app => {
          return app.id
      })
      let drivers = await Firebase.getAllRefs("drivers");
      drivers = drivers.filter(driver => applications.includes(driver.id))
      setApplications(drivers);
      setApplicationsFetched(true);
    })();
  }, [snackbar]);

  const approveDriver = (driverId) => {
    (async () => {
      try {
        await Firebase.updateRef(`driverApplications/${driverId}`, {status: "approved"})
        setSnackbar({open:true, message: "Driver approved successfully", color:"success"})
      } catch (error) {
        console.error(error)
        setSnackbar({open:true, message: "An error occured while trying to approve the driver", color:"error"})
      }
    })()
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Driver Applications
        </Typography>
        <TableContainer>
            <Table>
              <TableHead>
                <TableRow style={{ fontFamily: "Lato", fontWeight: "bolder" }}>
                  <TableCell>Driver</TableCell>
                  <Hidden xsDown>
                    <TableCell align="center">Email</TableCell>
                  </Hidden>
                  <TableCell align="center">Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.length < 1 && (
                  <TableRow>
                    <TableCell align="center" colSpan={4}>
                      You don't have any applications yet
                    </TableCell>
                  </TableRow>
                )}
                {applications.length > 0 &&
                  applications.map((driver, index) => (
                    <TableRow key={driver.id}>
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
                      <TableCell align="center">
                        <Button variant="contained" color="primary" onClick={e => approveDriver(driver.id)} size="lg">
                          Approve
                        </Button>
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

export default DriverApplications;