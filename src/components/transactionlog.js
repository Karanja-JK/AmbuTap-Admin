import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { format } from "date-fns";
import Loader from "./loader";
import Firebase from "../lib/firebase";
import { SnackbarContext } from "../App";

const describeTransaction = (transaction) => {
  return `${transaction.driver_name} picked up a patient from ${transaction.pickup_address} and took them to ${transaction.destination_address} at ${transaction.created_at}`
};

const TransactionLog = () => {
  const date = format(new Date(), "dd-MM-yyyy");

  const [transactions, setTransactions] = useState([]);
  const [driversOnline, setDriversOnline] = useState([]);
  const [transactionsFetched, setTransactionsFetched] = useState(false);
  const { snackbar } = useContext(SnackbarContext);

  useEffect(() => {
    (async () => {
      let transactions = await Firebase.getRefsByAttribute("AmbulanceRequest","status","ended");

      transactions.sort((a, b) => {
        return new Date(a.created_at) - new Date(b.created_at);
      });
      setTransactions(transactions);
      setTransactionsFetched(true);
      
      let driversOnline = await Firebase.getAllRefs("driversAvailable")
      setDriversOnline(driversOnline)
    })();
  }, [snackbar]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Card elevation={2}>
        <CardContent>
          <Typography variant="h5"  gutterBottom>
            Drivers Online
          </Typography>
          <Typography variant="h3" fontWeight="bold">
            {driversOnline.length}
          </Typography>
        </CardContent>
      </Card>
      </Grid>
      <Grid item xs={12}>
        <Card elevation={2}>
        <CardContent>
          <Typography variant="h3"  gutterBottom>
            AMBUTAP
          </Typography>
          <Typography variant="h5" gutterBottom>
            TRIPS LOG
          </Typography>
          {!transactionsFetched && <Loader />}
          {transactionsFetched && (
                <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow style={{ fontFamily: "Lato", fontWeight: "bolder" }}>
                          <TableCell>Time</TableCell>
                          <TableCell align="center">Driver</TableCell>
                          <TableCell align="center">Pickup</TableCell>
                          <TableCell align="center">Drop Off</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactions.length < 1 && (
                          <TableRow>
                            <TableCell align="center" colSpan={4}>
                              You don't have any transactions yet.
                            </TableCell>
                          </TableRow>
                        )}
                        {transactions.length > 0 &&
                          transactions.map((transaction, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                  <Typography>{format(new Date(transaction.created_at), "d/MM/yy hh:mm a")}</Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography>{transaction.driver_name}</Typography>
                              </TableCell>
                              <TableCell align="center">
                                {transaction.pickup_address}
                              </TableCell>
                              <TableCell align="center">
                                {transaction.destination_address}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
          )}
        </CardContent>
      </Card>
      </Grid>
    </Grid>
  );
};

export default TransactionLog;