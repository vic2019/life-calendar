import React, { useState, useEffect, useRef } from 'react';
import uuidv4 from 'uuid/v4';
import moment from 'moment';
import InputEpoch from './EpochForm';

const defaultEpoch1 = {
  uuid: uuidv4(),
  title: 'A',
  description: 'a good time, i suppose..',
  start: 0,
  end: 10,
  color: '#97e5fa',
};

const defaultEpoch2 = {
  uuid: uuidv4(),
  title: 'B',
  description: 'never ending happiness',
  start: 20,
  end: 30,
  color: '#abebc6',
};


export default function Calender({ userInfo, life }) {
  const prevLifespan = useRef(life.lifespan);
  const prevDOB = useRef(life.DOB.toString());
  const select = useRef();

  const [modal, setModal] = useState(false);
  const [units, setUnits] = useState(
    Array(life.lifespan * 26).fill()
  );
  
  // [defaultEpoch.checked, defaultEpoch.setChecked] = useState(false);
  const [epochs, setEpochs] = useState([futureEpoch(), defaultEpoch1, defaultEpoch2]);
  

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
        epochs={epochs}
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


function Unit({ index, epoch, epochs, children, setModal, select }) {
  function handleMouseUp(e) {
    const selection = window.getSelection();
    let anchor = selection.anchorNode.parentNode.id;
    let anchorEpoch;
    for (let epoch of epochs) {
      if (anchor >= epoch.start && anchor <= epoch.end) {
        anchorEpoch = epoch;
        break;
      }
    }

    let focus = selection.focusNode.parentNode.id;
    let focusEpoch;
    if (epoch && focus >= epoch.start && focus <= epoch.end) {
      focusEpoch = epoch;
    }

    if (anchor > focus) {
      [anchorEpoch, focusEpoch] = [focusEpoch, anchorEpoch];
    }

    let focusedEpoch;
    if (focusEpoch) {
      focusedEpoch = focusEpoch;
      focus = focusEpoch.end;
      if (anchorEpoch) {
        anchor = anchorEpoch.end + 1;
      }
    } else if (anchorEpoch) {
      focusedEpoch = anchorEpoch;
      anchor = anchorEpoch.start;
    }

    select.current = { start: anchor, end: focus, epoch: focusedEpoch };
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

