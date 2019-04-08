import React from 'react';
import { Tag } from 'antd';


export { randomColor };
export { MyTag };

function randomColor() {
  let hex = '#';
  for (let i = 0; i < 6; i++) {
    hex += '0369cf'[Math.floor( Math.random() * 6 )];
  }
  return hex;
}

function MyTag(props) {
  return (
    <span onClick={() => {props.onChecked && props.onChecked(props.value)}}>
      <Tag 
        color={props.color}
        // afterClose={props.afterClose? props.afterClose: null}
        // closable={props.closable? props.closable: null }
        // onClose={props.onClose? props.closable: null}
        // visible={props.visible? props.visible: null}
      >
        {props.children}
      </Tag>
    </span>
  );
}


