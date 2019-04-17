import React, { useState } from 'react';
import UserInfo from './UserInfo';
import Calendar from './Calendar';
import dayjs from 'dayjs';


const defaultLife = {
  DOB: dayjs(),
  lifespan: 0
};

// const test = {
//   DOB: dayjs('1990-04-16'),
//   lifespan: 100
// };


export default function App() {
  const [userInfo, setUserInfo] = useState({ name: '', gender: '' });
  const [life, setLife] = useState(defaultLife);

  return (    
    <div className='App'>
      <UserInfo setUserInfo={setUserInfo} setLife={setLife}/>
      <Calendar life={life}/>
    </div>
  );
};