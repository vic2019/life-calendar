import React, { useState, useEffect } from 'react';
import Week from './Week';


export default function Calender({ userInfo, epochs, setEpochs }) {
  const [weeks, setWeeks] = useState(Array(userInfo.duration).fill()
    .map(() => { return { content: '\u25a0' }; }));

  useEffect(() => {
    // alert('use effect duration');
    setWeeks(Array(userInfo.duration).fill()
      .map( () => { return { content: '\u25a0' }; } )
    );
  }, [userInfo.duration]);

  useEffect(() => {
    // alert('use effect weeks');
    setWeeks(oldWeeks => {
      return oldWeeks.map((item, index) => {
        for (let epoch of epochs) {
          if (index >= epoch.start && index <= epoch.end) {
            item.color = epoch.color;
          }
        }
        return item;
      })
    });
  }, [epochs]);

  return (
    <div className='Calender' style={calenderStyle}>
      {(weeks.length === 1)? null: weeks.map(
        (item, index) => <Week key={index} item={item}/>
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

