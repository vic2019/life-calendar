import React, { useState, useEffect, useRef } from 'react';
import InputEpoch from './EpochForm';
import dayjs from 'dayjs';
import uuidv4 from 'uuid/v4';


const WrappedTile = React.memo(Tile);

export default function Calendar({ life, epochs, setEpochs }) {
  // Only re-render when user changes input for DOB or expected lifespan
  const prevLife = useRef(life);
  const selectedEpoch = useRef(undefined);
  const selectedPeriod = useRef(undefined);

  const [tiles, setTiles] = useState(
    Array(life.lifespan * 26).fill().map( (_, index) => {
      return life.DOB.startOf('week').add(index * 2, 'week')
    })
  );
  const [modal, setModal] = useState(false);
  
  // Launch input fields when user selects a tile
  function handleMouseUp() {
    const selection = window.getSelection();
    if (!selection || !selection.anchorNode.parentNode.id) return;
    
    let anchor = dayjs(selection.anchorNode.parentNode.id);
    let focus = dayjs(selection.focusNode.parentNode.id);
    if (anchor === 'Invalid Date' || focus === 'Invalid Date') return;
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
  
  function processTile(item) {
    const id = item.format('YYYY-MM-DD');
    const age = 'Age ' + Math.floor(item.diff(life.DOB, 'year'));
    
    let assignedEpoch;
    for (let epoch of epochs) {
      if ( (item.isAfter(epoch.start) || item.isSame(epoch.start)) 
      && (item.isBefore(epoch.end) || item.isSame(epoch.end)) ) {
        assignedEpoch = epoch;
      }
    }
    
    const color = assignedEpoch? assignedEpoch.color: '#999999';
    const title = assignedEpoch? assignedEpoch.title + ' ' : '';

    return (
      <WrappedTile key={id} id={id} color={color} age={age} title={title}/>
    );
  }

  // Only reset epochs if user changes DOB
  useEffect( () => {
    if (!prevLife.current.DOB.isSame(life.DOB)) {
      setEpochs(initialEpochs(life));
      setTiles(Array(life.lifespan * 26).fill().map( (_, index) => {
        return life.DOB.startOf('week').add(index * 2, 'week');
      }));
      prevLife.current = life;

    } else if (prevLife.current.lifespan !== life.lifespan) {
      setTiles(Array(life.lifespan * 26).fill().map( (_, index) => {
        return life.DOB.startOf('week').add(index * 2, 'week');
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
      <div id='calendar-background'>
        <div id='tile-container' onMouseUp={handleMouseUp}>
          {tiles.length === 1 ? null: tiles.map(processTile)}
        </div>
      </div>
    </div>
  );
}


function Tile({ id, color, age, title }) {
  return (
      <span
        id={id}
        className='tile' 
        style={{color: color}}
      >
        {'\u25a0'}
        <span className='tooltip'>{title}{title? <br/>:''}{id}<br/>{age}</span>
      </span>
  );
}


function initialEpochs(life) {
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
    title: 'Middle & High School',
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