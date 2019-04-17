import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import UserInfo from './components/UserInfo';
import Calendar from './components/Calendar';
import { Drawer, Button } from 'antd';
import dayjs from 'dayjs';
import "antd/dist/antd.css";
import "./index.css";


const defaultLife = {
  DOB: dayjs(),
  lifespan: 0
};

const test = {
  DOB: dayjs('1990-04-16'),
  lifespan: 100
};

function Index() {
  const [userInfo, setUserInfo] = useState({ name: '', gender: '' });
  const [life, setLife] = useState(defaultLife);
  const [epochs, setEpochs] = useState();
  const [userId, setUserId] = useState(undefined);

  const [FB, setFB] = useState(undefined);

  document.addEventListener('FBObjectReady', () => setFB(window.FB));

  function handleFbLoginStatus(res) {
    if (res.status === 'connected') {
      setUserId(res.authResponse.userID);
    } else {
      setUserId(undefined);
    }
  };

  useEffect(() => {
    if(!FB) return;
    FB.getLoginStatus(handleFbLoginStatus);

    FB.Event.subscribe('auth.statusChange', handleFbLoginStatus);
    return FB.Event.unsubscribe('auth.statusChange');
  }, [FB]);

  return (
    <div className='MainContainer'>   
      <div className='App'>
        <UserInfo setUserInfo={setUserInfo} setLife={setLife}/>
        <Calendar life={life} epochs={epochs} setEpochs={setEpochs}/>
        {userId? <button className='loginButton'>{userId}</button>:null }
      </div>
    </div>
  );
};


ReactDOM.render(<Index/>, document.getElementById("root"));
