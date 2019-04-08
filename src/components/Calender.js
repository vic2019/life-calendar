import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button} from 'antd';
import Week from './Week';

export default function Calender({ userInfo, epochs, setEpochs }) {
  const [weeks, setWeeks] = useState(Array(userInfo.duration).fill().map(() => {
      return { content: '\u25a0', color: 'red' }
    }));

  useEffect(() => {
    setWeeks(
      Array(userInfo.duration).fill().map( () => { 
        return {content: '\u25a0', color: 'red'};
      })
    );
  });

  return (
    <div className='Calender' style={calenderStyle}>
      {(weeks.length === 1)? null: weeks.map(
        (item, i) => <Week key={i} item={item}/>
      )}
    </div>
  );
}

// Don't change the font-size easily!
const calenderStyle = {
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'flex-start',
  fontSize: '1.6em',
  lineHeight: '0.9',
}

