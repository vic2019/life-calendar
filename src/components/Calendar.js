import React, { useState, useEffect, useRef } from 'react';
import InputEpoch from './EpochForm';
import dayjs from 'dayjs';
import uuidv4 from 'uuid/v4';


export default function Calendar({ userInfo, life }) {
  const prevLife = useRef(life);
  const selectedEpoch = useRef(undefined);
  const selectedPeriod = useRef(undefined);

  const [modal, setModal] = useState(false);
  const [units, setUnits] = useState(
    Array(life.lifespan * 26).fill().map( (_, index) => {
      return { date: life.DOB.startOf('week').add(index * 2, 'week') }
    })
  );
  const [epochs, setEpochs] = useState(setInitialEpochs(life));
  
  
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
  

  function processUnit(item) {
    let assignedEpoch;
    let id = item.date.format('YYYY-MM-DD');

    for (let epoch of epochs) {
      if ( (item.date.isAfter(epoch.start) || item.date.isSame(epoch.start)) 
      && (item.date.isBefore(epoch.end) || item.date.isSame(epoch.end)) ) {
        assignedEpoch = epoch;
      }
    }
    
    return (
      <Unit
        key={id}
        id={id}
        assignedEpoch={assignedEpoch}
        handleMouseUp={handleMouseUp}
        >
        {'\u25a0'}
      </Unit>  
    );
  }


  useEffect( () => {
    if (!prevLife.current.DOB.isSame(life.DOB)) {
      setEpochs(setInitialEpochs(life));
      setUnits(Array(life.lifespan * 26).fill().map( (_, index) => {
        return { date: life.DOB.startOf('week').add(index * 2, 'week') };
      }));
      prevLife.current = life;

    } else if (prevLife.current.lifespan !== life.lifespan) {
      setUnits(Array(life.lifespan * 26).fill().map( (_, index) => {
        return { date: life.DOB.startOf('week').add(index * 2, 'week') };
      }));
      prevLife.current = life;

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
      <div className='Calendar'>
        {units.length === 1 ? null: units.map(processUnit)}
      </div>
    </div>
  );
}



function Unit(props) {
  const { id, assignedEpoch, children, handleMouseUp } = props;
  
  const color = { color: assignedEpoch? assignedEpoch.color: '#c0c3c4' };
  const title = assignedEpoch? assignedEpoch.title + ' ' : '';
  
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



function setInitialEpochs(life) {
  const birthWeek = life.DOB.startOf('week');
  const fallAt7Years = birthWeek.startOf('year').add(7*52 + 34, 'week');
  const springAt12Years = birthWeek.startOf('year').add(12*52 + 26, 'week');
  const fallAt12Years = springAt12Years.add(8, 'week');
  const springAt18Years = birthWeek.startOf('year').add(18*52 + 26, 'week');

  function getFutureWeek(birthWeek, futureDate) {
    const diffInWeeks = Math.floor(
      futureDate.diff( birthWeek, 'week' ) / 2
    ) * 2;

    return birthWeek.add(diffInWeeks, 'week');
  } 
  
  const childhood = {
    uuid: uuidv4(),
    title: 'Early Childhood',
    start: birthWeek,
    end: birthWeek.add(6 * 52, 'week'),
    color: '#FFC0CB'
  };
    
  const gradeschool = {
    uuid: uuidv4(),
    title: 'Grade School',
    start: getFutureWeek(birthWeek, fallAt7Years).add(2, 'week'),
    end: getFutureWeek(birthWeek, springAt12Years),
    color: '#c39bd3'
  };
  
  const highschool = {
    uuid: uuidv4(),
    title: 'Middle and High School',
    start: getFutureWeek(birthWeek, fallAt12Years).add(2, 'week'),
    end: getFutureWeek(birthWeek, springAt18Years),
    color: '#7fb3d5'
  }
  
  const future = {
    uuid: 'the future',
    title: 'The Future',
    start: dayjs(),
    end: birthWeek.add(101, 'year'),
    color: '#fff59d'
  };

  return [childhood, gradeschool, highschool, future];
}