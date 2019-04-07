import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button} from 'antd';

export default function Calender({ userInfo, epochs, setEpochs }) {
  const [weeks, setWeeks] = useState(Array(userInfo.duration).fill().map(() => {
      return { content: '🔲'}
    }));



  useEffect(() => {
    document.getElementById('test2').innerHTML = `
    name: ${userInfo.name} <Br> 
    gender: ${userInfo.gender} <Br>  
    birthday: ${userInfo.birthday} <Br> 
    lifespan: ${userInfo.lifespan} <Br>
    startOfWeek: ${userInfo.startOfWeek} <Br>
    duration: ${userInfo.duration}
    `
  });

  return (
    <div>
      <p id='test2'></p>
      <div style={{display: 'flex', flexFlow: 'row wrap', width: '1000px' }}>
        {weeks.map(item => <span>{item.content}</span>)}
      </div>
    </div>
  );
}

