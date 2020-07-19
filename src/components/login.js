import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  Container,
  TextField,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { LockOutlined } from "@material-ui/icons";
import firebase from "../lib/firebase";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const Login = () => {
  const classes = useStyles();

  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState("");

  const signIn = async () => {
    try {
      await firebase.signIn(email, password);
      history.replace("/");
    } catch (error) {
      let errorCode = error.code;
      let errorMessage = error.message;
      switch (errorCode) {
        case "auth/user-not-found":
          setError("The email address doesn't live here");
          setEmailError(true);
          break;
        case "auth/wrong-password":
          setError("The password you provided is wrong");
          setPasswordError(true);
          break;
        default:
          setError(errorMessage);
          break;
      }
    }
    return false;
  };

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <form
            className={classes.form}
            onSubmit={e => e.preventDefault() && false}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              type="email"
              value={email}
              error={emailError}
              onChange={e => setEmail(e.target.value)}
              onBlur={e => {
                emailRegex.test(e.target.value.toLowerCase())
                  ? setEmailError(false)
                  : setEmailError(true);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              error={passwordError}
              onChange={e => setPassword(e.target.value)}
              onBlur={e =>
                e.target.value.length >= 6
                  ? setPasswordError(false)
                  : setPasswordError(true)
              }
            />
            <Typography variant="body2" color="error">
              {error}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              type="submit"
              onClick={signIn}
            >
              Sign In
            </Button>
            {/*
            <!-- 
            <Grid container>
              <Grid item xs>
                <Link to="#">Forgot password?</Link>
              </Grid>
              <Grid item>
                <Link to="#">Don't have an account? Sign Up</Link>
              </Grid>
            </Grid>
            -->*/}
          </form>
        </div>
      </Container>
    </div>
  );
};

export default Login;