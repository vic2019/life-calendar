import React, { useState } from 'react';
import UserInfo from './UserInfo';
import Calender from './Calender';
import { Divider } from 'antd';

import dayjs from 'dayjs'; // for development only

const defaultUserInfo = {
  name: 'Jeanette',
  gender: 'female',
}

const defaultLife = {
  DOB: dayjs('1990-04-16'),
  lifespan: 95
}

export default function App() {
  const [userInfo, setUserInfo] = useState(defaultUserInfo);
  const [life, setLife] = useState(defaultLife);

  return (    
    <div className='App'>
      <UserInfo setUserInfo={setUserInfo} setLife={setLife}/>
      <Divider/>
      <Calender life={life} userInfo={userInfo}/>
    </div>
  );
}