import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button} from 'antd';

export default function Calender({ userInfo, epochs, setEpochs }) {
  const [weeks, setWeeks] = useState(Array(userInfo.duration).fill().map(() => {
      return { content: '🔲'}
    }));



  useEffect(() => {
    // document.getElementById('test2').innerHTML = `
    // name: ${userInfo.name} <Br> 
    // gender: ${userInfo.gender} <Br>  
    // birthday: ${userInfo.birthday} <Br> 
    // lifespan: ${userInfo.lifespan} <Br>
    // startOfWeek: ${userInfo.startOfWeek} <Br>
    // duration: ${userInfo.duration} <Br>
    // `;

    setWeeks(
      Array(userInfo.duration).fill().map( () => { return {content: '🔲'};} )
    );

  });

  return (
    <div className='Calender' style={calenderStyle}>
      {(weeks.length === 1)? null: weeks.map((item, i) => <span key={i}>{item.content}</span>)}
    </div>
  );
}

const calenderStyle = {
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'flex-start',
  fontSize: '0.8em',
}

