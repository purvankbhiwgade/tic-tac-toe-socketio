import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import FormState from "./context/FormState";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FormState>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FormState>
  </React.StrictMode>
);
