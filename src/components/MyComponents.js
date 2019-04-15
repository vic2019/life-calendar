import React from 'react';
import { Tag } from 'antd';


export { MyTag };
// export { randomColor };

// function randomColor() {
//   let hex = '#';
//   for (let i = 0; i < 6; i++) {
//     hex += '0369cf'[Math.floor( Math.random() * 6 )];
//   }
//   return hex;
// }

function MyTag(props) {
  return (
    <span onClick={() => {props.onChecked && props.onChecked(props.value)}}>
      <Tag 
        color={props.color}
      >
        {props.children}
      </Tag>
    </span>
  );
}


