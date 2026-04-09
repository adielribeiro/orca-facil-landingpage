import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1565c0"
    },
    secondary: {
      main: "#2e7d32"
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff"
    }
  },
  shape: {
    borderRadius: 18
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    h1: {
      fontWeight: 900
    },
    h2: {
      fontWeight: 900
    },
    h3: {
      fontWeight: 800
    },
    h4: {
      fontWeight: 800
    },
    h5: {
      fontWeight: 700
    },
    h6: {
      fontWeight: 700
    },
    button: {
      textTransform: "none",
      fontWeight: 700
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          minHeight: 46,
          paddingInline: 18
        }
      }
    }
  }
});

export default theme;