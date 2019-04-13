import React, { useState, useEffect, useRef } from 'react';
import InputEpoch from './EpochForm';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import uuidv4 from 'uuid/v4';

const defaultEpoch1 = {
  uuid: uuidv4(),
  title: 'A',
  description: 'A des',
  start: dayjs('1990-04-16').startOf('week'),
  end: dayjs('1990-04-16').startOf('week').add(104, 'week'),
  color: '#97e5fa',
};

const defaultEpoch2 = {
  uuid: uuidv4(),
  title: 'B',
  description: 'B des',
  start: dayjs('1990-04-16').startOf('week').add(208, 'week'),
  end: dayjs('1990-04-16').startOf('week').add(832, 'week'),
  color: '#abebc6',
};


export default function Calender({ userInfo, life }) {
  const prevDOB = useRef(life.DOB);
  const selectedEpoch = useRef(undefined);
  const selectedPeriod = useRef({});

  const [modal, setModal] = useState(false);
  const [units, setUnits] = useState(
    Array(life.lifespan * 26).fill().map( (_, index) => {
      return { date: life.DOB.startOf('week').add(index * 2, 'week') }
    })
  );

  // [defaultEpoch.checked, defaultEpoch.setChecked] = useState(false);
  const [epochs, setEpochs] = useState([
    futureEpoch(), 
    defaultEpoch1, 
    defaultEpoch2
  ]);
  
  function futureEpoch() {
    return {
      uuid: 'the future',
      title: '',
      description: '',
      start: dayjs().startOf('week'),
      end: life.DOB.startOf('week').add(131, 'year'),
      color: '#f9e79f'
    }
  };

  const assignEpoch = (item, index) => {
    let assignedEpoch;
    for (let epoch of epochs) {
      if ( (item.date.isAfter(epoch.start) || item.date.isSame(epoch.start)) 
        && (item.date.isBefore(epoch.end) || item.date.isSame(epoch.end)) ) {
        assignedEpoch = epoch;
      }
    }

    return (
      <Unit
        item={item}
        epoch={assignedEpoch} 
        epochs={epochs}
        setModal={setModal} 
        selectedEpoch={selectedEpoch}
        selectedPeriod={selectedPeriod}
      >
        {'\u25a0'}
      </Unit>
    );
  };


  useEffect( () => {
    setUnits(Array(life.lifespan * 26).fill().map( (_, index) => {
      return { date: life.DOB.startOf('week').add(index * 2, 'week') };
    }));

    if (!prevDOB.current.isSame(life.DOB)) {
      setEpochs([futureEpoch()]);
      prevDOB.current = life.DOB;
    }
  }, [life]);


  return (
    <div>
      <InputEpoch 
        modal={modal} 
        setModal={setModal}
        epochs={epochs} 
        setEpochs={setEpochs}
        selectedEpoch={selectedEpoch}
        selectedPeriod={selectedPeriod}
      />
      <div className='Calender' style={calenderStyle}>
        {units.length === 1 ? null: units.map(assignEpoch)}
      </div>
    </div>
  );
}


function Unit(props) {
  const {item, epoch, epochs, setModal, selectedEpoch, selectedPeriod, children}
    = props;
  const id = item.date.format('YYYY-MM-DD');
  const color = { color: epoch? epoch.color: '#808b96' };
  const title = epoch? epoch.title + '  ' : '';

  function handleMouseUp() {
    const selection = window.getSelection();
    
    let anchor = dayjs(selection.anchorNode.parentNode.id);
    let focus = dayjs(selection.focusNode.parentNode.id);
    if (anchor.isAfter(focus)) [anchor, focus] = [focus, anchor];
    
    selectedEpoch.current = undefined;
    for (let epoch of epochs) {
      if (epoch.start.isSame(anchor) && epoch.end.isSame(focus)) {
        selectedEpoch.current = epoch;    
      }
    }
    
    selectedPeriod.current = { start: anchor, end: focus };
    setModal(true);
  }

  return (
      <span
        id={id}
        className='Unit' 
        style={color}
        onMouseUp={handleMouseUp}
      >
        {children}
        <span className='Tooltip'>{title}{id}</span>
      </span>
  );
}


// Don't change the font-size easily!
const calenderStyle = {
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'flex-start',
  fontSize: '1.4em',
  lineHeight: '0.9',
}

