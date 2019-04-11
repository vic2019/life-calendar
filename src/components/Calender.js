import React, { useState, useEffect, useRef } from 'react';
import uuidv4 from 'uuid/v4';
import moment from 'moment';
import InputEpoch from './EpochForm';

const defaultEpoch = {
  uuid: uuidv4(),
  title: 'childhood',
  description: 'a good time, i suppose..',
  start: 0,
  end: 15*26,
  color: '#97e5fa',
};


export default function Calender({ userInfo, life }) {
  const prevLifespan = useRef(life.lifespan);
  const prevDOB = useRef(life.DOB.toString());
  const select = useRef();

  const [modal, setModal] = useState(false);
  const [units, setUnits] = useState(
    Array(life.lifespan * 26).fill()
  );
  
  [defaultEpoch.checked, defaultEpoch.setChecked] = useState(false);
  const [epochs, setEpochs] = useState([futureEpoch(), defaultEpoch]);
  

  function futureEpoch() {
    const unitZero = moment(life.DOB).startOf('week');
    const unitNow = Math.floor(moment.duration(moment().diff(unitZero))
      .as('week') / 2);

    return {
      uuid: uuidv4(),
      title: 'time to come',
      description: 'make the best use of it',
      start: unitNow,
      end: life.lifespan * 26,
      color: '#ffe57a'
    }
  };


  const assignEpoch = (_, index) => {
    let assignedEpoch;
    for (let epoch of epochs) {
      if (index < epoch.start || index > epoch.end) continue;
      assignedEpoch = epoch;  
    }

    return (
      <Unit
        index={index}
        epoch={assignedEpoch} 
        setModal={setModal} 
        select={select}
      >
        {'\u25a0'}
      </Unit>
    );
  };


  useEffect(() => {
    if (prevLifespan.current === life.lifespan) return;
    setUnits(Array(life.lifespan * 26).fill({ content: '\u25a0' }));
    prevLifespan.current = life.lifespan;
  }, [life.lifespan]);

  useEffect(() => {
    if(prevDOB.current === life.DOB.toString()) return;
    setEpochs([futureEpoch()]);
    prevDOB.current = life.DOB.toString();
  }, [life.DOB]);


  return (
    <div>
      <InputEpoch 
        modal={modal} 
        setModal={setModal}
        epochs={epochs} 
        setEpochs={setEpochs}
        select={select}
      />
      <div className='Calender' style={calenderStyle}>
        {units.length === 1 ? null: units.map(assignEpoch)}
      </div>
    </div>
  );
}


function Unit({ index, epoch, children, setModal, select }) {
  function handleMouseUp() {
    const selection = window.getSelection();
    const start = selection.anchorNode.parentNode.id;
    const end = selection.focusNode.parentNode.id;

    select.current = { start: start, end: end };
    setModal(true);
  }

  return (
    <span
      id={String(index)}
      className='Unit' 
      style={{color: epoch? epoch.color: null}}
      onMouseUp={handleMouseUp}
    >
      {children}
    </span>
  );
}


// Don't change the font-size easily!
const calenderStyle = {
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'flex-start',
  fontSize: '1.2em',
  lineHeight: '0.9',
}

