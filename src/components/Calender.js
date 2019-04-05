import React, { useEffect } from 'react';
import { Modal, Form, Input, Button} from 'antd';

export default function Calender({ userInfo, epochs, setEpochs }) {
  
  useEffect(() => {
    document.getElementById('test2').innerHTML = `
    name: ${userInfo.name} <Br> 
    gender: ${userInfo.gender} <Br>  
    birthday: ${userInfo.birthday} <Br> 
    lifespan: ${userInfo.lifespan} <Br>
    duration: ${userInfo.duration}
    `
  });

  return (
    <div>
      <p id='test2'></p>
    </div>
  );
}

