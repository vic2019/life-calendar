import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";
import "antd/dist/antd.css";


ReactDOM.render( 
  <div className='MainContainer'>
    {/* <div className='Header'/> */}
    <div className='Row'>
      <App/>
    </div>
  </div>,
  document.getElementById("root")
  );
  