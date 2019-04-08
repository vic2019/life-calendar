import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";
import "antd/dist/antd.css";

ReactDOM.render( 
  <div className='container'>
    <div className='header'/>
    <div className='row'>
      <App/>
    </div>
  </div>,
  document.getElementById("root")
  );
  