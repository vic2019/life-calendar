import React from 'react';
import { Tag } from 'antd';


export default function MyTag(props) {
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


