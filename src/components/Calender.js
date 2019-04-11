import React, { useState, useEffect, useRef, Button } from 'react';
import uuidv4 from 'uuid/v4';
import moment from 'moment';
import WrappedEpochForm from './EpochInfo';

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
  const [units, setUnits] = useState(
    Array(life.lifespan * 26).fill({ content: '\u25a0' })
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


  const assignEpoch = (unit, index) => {
    let assignedEpoch;
    for (let epoch of epochs) {
      if (index >= epoch.start && index <= epoch.end) {
        assignedEpoch = epoch;

        return <Unit unit={unit} epoch={assignedEpoch}/>;
      }
    }

  return <Unit unit={unit} epoch={assignedEpoch}/>;
  };


  useEffect(() => {
    if (prevLifespan.current === life.lifespan) return;
    setUnits(Array(life.lifespan * 26).fill({ content: '\u25a0' }));
    alert('lifespan');
    prevLifespan.current = life.lifespan;
  }, [life.lifespan]);

  useEffect(() => {
    if(prevDOB.current === life.DOB.toString()) return;
    setEpochs([futureEpoch()]);
    alert('DOB');
    prevDOB.current = life.DOB.toString();
  }, [life.DOB]);

  // const createEpoch = () => {
  //   const { epoch, setEpoch } = createEpoch
  //   setEpochs([...epochs,)
  // }


  return (
    <div>
      {epochs[0].start} 
    {/* <CreateEpoch epochs={epochs}/> */}
    <div className='Calender' style={calenderStyle}>
      {units.length === 1 ? null: units.map(assignEpoch)}
    </div>
    </div>
  );
}


function Unit({ unit, epoch }) {
  return (
    <span className='Unit' style={{color: epoch? epoch.color: null}}>
      {unit.content}
    </span>
  );
}


// function CreateEpoch(props) {
//   const [visible, setVisible] = useState(false);
//   let wrappedFormRef

//   const handleCancel = () => {
//     setVisible(false);
//     wrappedFormRef.props.form.resetFields();
//   };

//   const handleCreate = () => {
//     const form = wrappedFormRef.props.form;
//     form.validateFields((err, values) => {
//       if (err) {
//         return;
//       }

//       props.setEpochs( epochs => {
//         return [...epochs, {
//           title: values.title.trim(),
//           description: (values.description || '').trimRight(),
//           color: values.color,
//           start: 7*26,
//           end: 9*26
//         }];
//       });
//       setVisible(false);
//       form.resetFields();
//     });
//   }

//   const showModal = () => {
//     setVisible(true);
//   }

//   const passFormRef = formRef => {
//     wrappedFormRef = formRef;
//   }

//   return (
//     <div>
//       <Button onClick={showModal}>Modal</Button>
//       <WrappedEpochForm 
//         wrappedComponentRef={passFormRef}
//         visible={visible}
//         onCancel={handleCancel}
//         onCreate={handleCreate}
//         epochs={props.epochs}
//       />
//     </div>
//   );
// }



// Don't change the font-size easily!
const calenderStyle = {
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'flex-start',
  fontSize: '1.2em',
  lineHeight: '0.9',
}

