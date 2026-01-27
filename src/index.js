import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const muiTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4F46E5",
    },
    secondary: {
      main: "#64748B",
    },
    background: {
      default: "#F7F9FC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F2937",
      secondary: "#64748B",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  shape: {
    borderRadius: 12,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <MuiThemeProvider theme={muiTheme}>
          <CssBaseline />
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </MuiThemeProvider>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
