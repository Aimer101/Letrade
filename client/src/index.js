import React from "react";
import ReactDOM from "react-dom";
import { UserContextProvider } from "./context/UserContext";
import App from "./App";

ReactDOM.render(
  <UserContextProvider>
    <App />
  </UserContextProvider>,
  document.getElementById("root")
);
