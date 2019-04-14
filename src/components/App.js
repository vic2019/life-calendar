import React, { useState } from 'react';
import UserInfo from './UserInfo';
import Calendar from './Calendar';
import { Divider } from 'antd';
import dayjs from 'dayjs';


const defaultLife = {
  DOB: dayjs(),
  lifespan: 32
}

export default function App() {
  const [userInfo, setUserInfo] = useState({ name: '', gender: '' });
  const [life, setLife] = useState(defaultLife);

  return (    
    <div className='App'>
      <UserInfo setUserInfo={setUserInfo} setLife={setLife}/>
      <Divider/>
      <Calendar life={life} userInfo={userInfo}/>
    </div>
  );
}