import React, { useState } from "react";
import BasicInfo from "./BasicInfo";
import Calender from "./Calender";
import moment from 'moment';

const defaultEpochs =[{
    title: 'childhood',
    description: 'My lovely childhood',
    start: 0,
    end: 780,
    color: '#FFD700'
  },
  {
    title: 'college',
    description: 'A dark time',
    start: 936,
    end: 1144, 
    color: '#87CEFA'
  },
  {
    title: 'law school',
    description: 'Thus began the disillusionment',
    start: 1300,
    end: 1456,
    color: '#DC143C'
  }];

const defaultUserInfo = {
  name: 'Victor',
  gender: 'male',
  birthday: moment('1990-01-01'),
  lifespan: 80,
  duration: 80 * 52,
};

export default function App() {
  const [userInfo, setUserInfo] = useState(defaultUserInfo);
  const [epochs, setEpochs] = useState(defaultEpochs);

  return (    
    <div>
      <BasicInfo userInfo={userInfo} setUserInfo={setUserInfo} />
      <Calender userInfo={userInfo} epochs={epochs} setEpochs={setEpochs} />
    </div>
  );
}