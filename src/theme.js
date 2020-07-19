import { createMuiTheme } from "@material-ui/core/styles";
// Create a theme instance.

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FF3D00"
    },
    secondary: {
      main: "#6A45C4"
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: `'Montserrat', 'Helvetica', sans-serif`,
    button: {
      fontFamily: `'Lato', 'Helvetica', sans-serif`,
      fontWeight: "bolder"
    },
    h1: {
      fontFamily: `'Lato', 'Helvetica', sans-serif`
    },
    h2: {
      fontFamily: `'Lato', 'Helvetica', sans-serif`
    },
    h3: {
      fontFamily: `'Lato', 'Helvetica', sans-serif`
    },
    h4: {
      fontFamily: `'Lato', 'Helvetica', sans-serif`
    },
    h5: {
      fontFamily: `'Lato', 'Helvetica', sans-serif`
    },
    h6: {
      fontFamily: `'Lato', 'Helvetica', sans-serif`
    }
  }
});

export default theme;