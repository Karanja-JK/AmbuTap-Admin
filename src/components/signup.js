import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import Helmet from "react-helmet";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
  ButtonGroup
} from "@material-ui/core";
import { VisibilityOutlined, VisibilityOffOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { SnackbarContext } from "./App";
import Firebase from "../lib/firebase";

const useStyles = makeStyles(theme => ({
  dp: {
    height: "10em",
    width: "10em",
    objectFit: "cover",
    borderRadius: "50%"
  },
  fullHeight: {
    height: "100vh"
  },
  input: {
    display: "none"
  },
  submit: {
    margin: theme.spacing(3, 0, 0)
  },
  textCenter: {
    textAlign: "center"
  }
}));

const SignUp = props => {
  const classes = useStyles();

  const [formDetails, setFormDetails] = useState({
    accountType: "Individual",
    username: "",
    phone: "",
    email: "",
    password: ""
  });

  const [formErrors, setFormErrors] = useState({
    username: false,
    phone: false,
    email: false,
    password: false
  });

  const [showPassword, setShowPassword] = useState(false);

  const phoneRegex = /^[+]?[0-9]{5,15}/;
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const photoInput = useRef(null);
  const dp = useRef(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [uid, setUid] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const { setSnackbar } = useContext(SnackbarContext);

  // After the user has been created upload their profile picture if available
  useEffect(() => {
    if (uid) {
      if (profilePicture) {
        setUploading(true);
        let uploadTask = Firebase.uploadFile(
          "profile_images",
          profilePicture,
          uid
        );
        uploadTask.on(
          "state_changed",
          snapshot => {
            let progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          error => {
            console.error(error);
            setUploading(false);
          },
          async () => {
            let downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
            setProfileImageUrl(downloadURL);
          }
        );
      } else {
        setProfileImageUrl("");
      }
    }
  }, [uid]);

  // Create the DB ref after the profile picture has been set and redirect the user to the dashboard
  useEffect(() => {
    if (profileImageUrl !== null) {
      let data = {
        ...formDetails,
        profileImageUrl,
        paymentmethod: "Cash",
        premium: "No"
      };
      // We dont want to put the users pwd in the DB
      delete data.password;

      Firebase.createRef(`Users/Customers/${uid}`, data).then(
        successValue => {
          props.history.replace("/");
        },
        rejectedReason => {
          console.error(rejectedReason);
        }
      );
    }
  }, [profileImageUrl]);

  const changeImageURL = () => {
    if (photoInput.current.files && photoInput.current.files[0]) {
      setProfilePicture(photoInput.current.files[0]);
      let reader = new FileReader();
      reader.onload = e => {
        dp.current.setAttribute("src", e.target.result);
      };
      reader.readAsDataURL(photoInput.current.files[0]);
    }
  };

  /**
   * Creates a user and triggers these side effects:
   *
   * 1) After setting the user's uid, their dp will be uploaded
   *
   * 2) After the dp has been uploaded a ref will be created in the DB
   */
  const createUser = () => {
    Firebase.createUserWithEmailAndPassword(
      formDetails.email,
      formDetails.password
    )
      .then(userCredential => {
        let uid = userCredential.user.uid;
        setUid(uid);
        setSnackbar({
          message: "Your account has been created",
          open: true,
          color: "success"
        });
      })
      .catch(reason => {
        if (reason.code == "auth/email-already-in-use") {
          setSnackbar({
            message: "This email is already in use.",
            color: "error",
            open: true
          });
        } else if (reason.code == "auth/weak-password") {
          setSnackbar({
            message:
              "Please use a stronger password that's more than 6 symbols.",
            color: "error",
            open: true
          });
        }
      });
  };

  return (
    <>
      <Helmet>
        <title>Sign Up | Vibarua</title>
      </Helmet>
      <Container>
        <Grid
          className={classes.fullHeight}
          container
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <form
              onSubmit={e => {
                e.preventDefault();
                createUser();
              }}
            >
              <Grid
                container
                alignItems="center"
                direction="column"
                className={classes.textCenter}
              >
                <img
                  ref={dp}
                  className={classes.dp}
                  alt="Your profile picture"
                  src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.OWyfSNvxthqghg0bHhggQwHaFj%26pid%3DApi&f=1"
                />
                {uploading && (
                  <Box mt="0.25em" mb="1em" width="80%">
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                    />
                  </Box>
                )}
                <input
                  accept="image/*"
                  className={classes.input}
                  id="photoInput"
                  multiple
                  ref={photoInput}
                  onChange={changeImageURL}
                  type="file"
                />
                <Box my="0.5em">
                  <label htmlFor="photoInput">
                    <Button component="span">Choose a Profile Picture</Button>
                  </label>
                </Box>
              </Grid>
              <Box my="1em">
                <ButtonGroup
                  color="secondary"
                  aria-label="Account Type"
                  size="medium"
                  fullWidth
                >
                  <Button
                    variant={
                      formDetails.accountType == "Business"
                        ? "contained"
                        : "outlined"
                    }
                    onClick={e =>
                      setFormDetails({
                        ...formDetails,
                        accountType: "Business"
                      })
                    }
                    disableElevation
                  >
                    Business
                  </Button>
                  <Button
                    variant={
                      formDetails.accountType == "Individual"
                        ? "contained"
                        : "outlined"
                    }
                    onClick={e =>
                      setFormDetails({
                        ...formDetails,
                        accountType: "Individual"
                      })
                    }
                    disableElevation
                  >
                    Individual
                  </Button>
                </ButtonGroup>
              </Box>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Name"
                name="username"
                autoFocus
                type="text"
                value={formDetails.username}
                error={formErrors.username}
                onChange={e =>
                  setFormDetails({ ...formDetails, username: e.target.value })
                }
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="phone"
                label="Phone Number"
                name="phone"
                autoComplete="tel"
                type="text"
                value={formDetails.phone}
                error={formErrors.phone}
                onChange={e =>
                  setFormDetails({ ...formDetails, phone: e.target.value })
                }
                onBlur={e => {
                  phoneRegex.test(e.target.value)
                    ? setFormErrors({ ...formErrors, phone: false })
                    : setFormErrors({ ...formErrors, phone: true });
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
                value={formDetails.email}
                error={formErrors.email}
                onChange={e =>
                  setFormDetails({ ...formDetails, email: e.target.value })
                }
                onBlur={e => {
                  emailRegex.test(e.target.value.toLowerCase())
                    ? setFormErrors({ ...formErrors, email: false })
                    : setFormErrors({ ...formErrors, email: true });
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                value={formDetails.password}
                error={formErrors.password}
                onChange={e =>
                  setFormDetails({ ...formDetails, password: e.target.value })
                }
                onBlur={e =>
                  e.target.value.length >= 6
                    ? setFormErrors({ ...formErrors, password: false })
                    : setFormErrors({ ...formErrors, password: true })
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton onClick={e => setShowPassword(!showPassword)}>
                        {showPassword ? (
                          <VisibilityOffOutlined />
                        ) : (
                          <VisibilityOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
                type="submit"
              >
                Sign Up
              </Button>
              <Typography variant="caption">
                Already have an account?{" "}
                <Link style={{ textDecoration: "none" }} to="/signin">
                  Sign In
                </Link>
              </Typography>
            </form>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default withRouter(SignUp);
