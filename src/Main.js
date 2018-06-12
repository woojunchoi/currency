import React from "react";
import { render } from "react-dom";
import App from "./App";

render(
    // added inline styling to reduce number of css files
    <div style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center', height:'500px'}}>
        <title>Bob's Banana Budget</title>
        <App />
    </div>,
  document.getElementById("container")
);