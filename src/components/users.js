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

const Users = () => {
  const date = format(new Date(), "dd-MM-yyyy");

  const [users, setUsers] = useState([]);
  const [usersFetched, setUsersFetched] = useState(false);
  const { snackbar } = useContext(SnackbarContext);

  useEffect(() => {
    (async () => {
      let users = await Firebase.getAllRefs("users");
      setUsers(users);
      setUsersFetched(true);
    })();
  }, [snackbar]);

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Users
        </Typography>
        <TableContainer>
            <Table>
              <TableHead>
                <TableRow style={{ fontFamily: "Lato", fontWeight: "bolder" }}>
                  <TableCell>User</TableCell>
                  <Hidden xsDown>
                    <TableCell align="center">Email</TableCell>
                  </Hidden>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length < 1 && (
                  <TableRow>
                    <TableCell align="center" colSpan={4}>
                      You don't have any users yet
                    </TableCell>
                  </TableRow>
                )}
                {users.length > 0 &&
                  users.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Grid container direction="row" alignItems="center">
                          <Avatar style={{ marginRight: "1em" }}>
                            {user.fullname[0]}
                          </Avatar>
                          <Typography>{user.fullname}</Typography>
                        </Grid>
                      </TableCell>
                      <Hidden xsDown>
                        <TableCell align="center">
                          {user.email}
                        </TableCell>
                      </Hidden>
                      <TableCell align="center">
                        <IconButton>
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton>
                          <EditOutlined />
                        </IconButton>
                        <IconButton>
                          <DeleteOutline />
                        </IconButton>
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

export default Users;