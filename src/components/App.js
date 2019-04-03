import React, { useState } from "react";
import BasicInfo from "./BasicInfo";
import Calender from "./Calender";

const defaultEpochs =[{
    title: 'childhood',
    startDate: '1990-01-01',
    endDate: '2005-06-15'
  },
  {
    title: 'highschool',
    startDate: '2005-07-30',
    endDate: '2008-06-15'
  },
  {
    title: 'law school',
    startDate: '2015-08-01',
    endDate: '2018-05-24'
  }];

const defaultUserInfo = {
  bday: '1993-06-15',
  lifeSpan: 80,
};

export default function App() {
  const [userInfo, setUserInfo] = useState(defaultUserInfo);
  const [epochs, setEpochs] = useState(defaultEpochs);

  return (    
    <div>
      <BasicInfo userInfo={userInfo} setUserInfo={setUserInfo} />
      <Calender epochs={epochs} setEpochs={setEpochs} />
    </div>
  );
}