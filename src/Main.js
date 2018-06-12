import React from "react";
import { render } from "react-dom";
import App from "./App";

render(
    <div style={{width:'100%', display:'flex', justifyContent:'center', margin:'0 auto', backgroundColor:'#f1f2ed'}}>
        <App />
    </div>,
  document.getElementById("container")
);