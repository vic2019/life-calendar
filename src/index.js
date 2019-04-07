import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";
import "antd/dist/antd.css";


const headerStyle = {
  backgroundColor: '#34495e'
}

ReactDOM.render( 
  <div className='container'>
    <div className='header' style={headerStyle}/>
    <div className='row'>
      <App/>
    </div>
  </div>,
  document.getElementById("root")
  );
  