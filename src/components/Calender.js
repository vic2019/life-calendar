import React, { useState, useEffect, useRef } from 'react';
import InputEpoch from './EpochForm';
import dayjs from 'dayjs';
import uuidv4 from 'uuid/v4';


export default function Calender({ userInfo, life }) {
  const prevDOB = useRef(life.DOB);
  const selectedEpoch = useRef(undefined);
  const selectedPeriod = useRef(undefined);

  const [modal, setModal] = useState(false);
  const [units, setUnits] = useState(
    Array(life.lifespan * 26).fill().map( (_, index) => {
      return { date: life.DOB.startOf('week').add(index * 2, 'week') }
    })
  );

  const [epochs, setEpochs] = useState([
    childhoodEpoch(),
    gradeSchoolEpoch(),
    futureEpoch(), 
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

  function childhoodEpoch() {


    return {
      uuid: uuidv4(),
      title: 'Early Childhood',
      start: life.DOB.startOf('week'),
      end: life.DOB.startOf('week').add(Math.floor(life.DOB.add(6, 'year').diff(life.DOB.startOf('week'), 'week')/2)*2, 'week'),
      color: '#b3e5fc'
    };
  }

  function gradeSchoolEpoch() {
    const birthWeek = life.DOB.startOf('week');
    const sixYearsOld = birthWeek.startOf('year').add(7*52 + 32, 'week');
    const twelveYearsOld = birthWeek.startOf('year').add(12*52 + 24, 'week')
    const diff6 = Math.floor(sixYearsOld.diff(birthWeek, 'week')/2)*2;
    const diff12 = Math.floor(twelveYearsOld.diff(birthWeek, 'week')/2)*2;

    return {
      uuid: uuidv4(),
      title: 'Grade School',
      start: birthWeek.add(diff6 + 2, 'week'),
      end: birthWeek.add(diff12 + 2, 'week' ),
      color: '#7fb3d5'
    };
  }


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
      setEpochs([
        childhoodEpoch(),
        gradeSchoolEpoch(),
        futureEpoch(), 
      ]);
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
  const color = { color: epoch? epoch.color: '#c0c3c4' };
  const title = epoch? epoch.title + '  ' : '';

  function handleMouseUp() {
    const selection = window.getSelection();
    
    let anchor = dayjs(selection.anchorNode.parentNode.id);
    let focus = dayjs(selection.focusNode.parentNode.id);
    if (anchor.isAfter(focus)) [anchor, focus] = [focus, anchor];
    selectedPeriod.current = { start: anchor, end: focus };
    
    selectedEpoch.current = undefined;
    for (let epoch of epochs) {
      if (epoch.start.isSame(anchor) && epoch.end.isSame(focus)) {
        selectedEpoch.current = epoch;    
      }
    }
    
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

