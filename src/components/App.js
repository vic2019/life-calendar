import React, { useState } from "react";
import BasicInfo from "./BasicInfo";
import Calender from "./Calender";
import moment from 'moment';
import { Divider } from 'antd';

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
  name: 'Jason',
  gender: 'male',
  birthday: moment('1989-02-01'),
  lifespan: 35,
  startOfWeek: moment(moment('1989-02-01')).startOf('week'),
  duration: null,
};

export default function App() {
  const [userInfo, setUserInfo] = useState(defaultUserInfo);
  const [epochs, setEpochs] = useState(defaultEpochs);

  return (    
    <div className='App'>
      <BasicInfo userInfo={userInfo} setUserInfo={setUserInfo} />
      <Divider/>
      <Calender userInfo={userInfo} epochs={epochs} setEpochs={setEpochs} />
    </div>
  );
}