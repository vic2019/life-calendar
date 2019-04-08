import React, { useState } from "react";
import BasicInfo from "./BasicInfo";
import Calender from "./Calender";
import { Divider } from 'antd';
import EpochInfo from './EpochInfo';

const defaultEpochs =[{
    title: 'childhood',
    description: 'My lovely childhood',
    start: 0,
    end: 2*52 - 1,
    color: 'yellow'
  },
  {
    title: 'college',
    description: 'A dark time',
    start: 2*52,
    end: 3*52, 
    color: 'blue'
  },
  {
    title: 'law school',
    description: 'Thus began the disillusionment',
    start: 4*52,
    end: 5*52,
    color: 'purple'
  }];

const defaultUserInfo = {
  duration: 10*52,
};

export default function App() {
  const [userInfo, setUserInfo] = useState(defaultUserInfo);
  const [epochs, setEpochs] = useState(defaultEpochs);

  return (    
    <div className='App'>
      <BasicInfo userInfo={userInfo} setUserInfo={setUserInfo} />
      <Divider/>
      <EpochInfo setEpochs={setEpochs}/>
      <Calender userInfo={userInfo} epochs={epochs} setEpochs={setEpochs} />
    </div>
  );
}