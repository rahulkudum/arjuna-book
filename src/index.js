import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { TotalStorage } from "./context/storage";

ReactDOM.render(
 <React.StrictMode>
  <BrowserRouter>
   <TotalStorage>
    <App />
   </TotalStorage>
  </BrowserRouter>
 </React.StrictMode>,
 document.getElementById("root")
);
