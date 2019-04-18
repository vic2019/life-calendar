import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import UserInfo from './components/UserInfo';
import Calendar from './components/Calendar';
import LoginButton from './components/LoginButton';
import ActionButtons from './components/ActionButtons';
import { message } from 'antd';
import dayjs from 'dayjs';
import "antd/dist/antd.css";
import "./index.css";

import uuidv4 from 'uuid/v4';


const defaultLife = {
  DOB: dayjs(),
  lifespan: 0
};

const test = {
  DOB: dayjs('1990-04-16'),
  lifespan: 100
};

if (window.screen.width < 1000) {
  message.info("For a better user experience, please consider visiting this site on a computer :)", 9);
}


function Index() {
  const [userInfo, setUserInfo] = useState({ name: '', gender: '' });
  const [life, setLife] = useState(test);
  const [epochs, setEpochs] = useState(setInitialEpochs(life));
  const [user, setUser] = useState(undefined);


  const [FB, setFB] = useState(undefined);

  document.addEventListener('FBObjectReady', () => setFB(window.FB));

  function handleFbLoginStatus(res) {
    if (res.status === 'connected') {
      const id = res.authResponse.userID;
      FB.api(
        '/'+id,
        'GET',
        {"fields":"id,first_name,middle_name,last_name"},
        res => {
          message.success(
            <span>
              {`Logged in as ${res.first_name} ${res.last_name}`}<br/><br/>
              <img 
                src={`http://graph.facebook.com/${res.id}/picture?type=normal`}
                alt=''
              />
            </span>, 
            4
          );
          setUser({
            id: res.id,
            firstName: res.first_name,
            middleName: res.middle_name,
            lastName: res.last_name,
          });
        }
      );     
    } else {
      setUser(undefined);
    }
  };
  
  function handleLoginBtnClick() {
    FB.login(handleFbLoginStatus);
  };
  
  function saveData() {
    
  };

  function logout() {
    setUser(undefined);
    message.success("Logout success!", 3);
  }

  function deleteData() {

  }

  useEffect(() => {
    if(!FB) return;
    FB.getLoginStatus(handleFbLoginStatus);
  }, [FB]);

  return (
    <div className='MainContainer'>   
      <div className='App'>
        <UserInfo setUserInfo={setUserInfo} setLife={setLife}/>
        <Calendar life={life} epochs={epochs} setEpochs={setEpochs}/>
        {life.lifespan? user? 
          <ActionButtons
            saveData={saveData}
            logout={logout}
            deleteData={deleteData}
            name={user.firstName}
          /> : FB? 
          <LoginButton
            handleClick={handleLoginBtnClick}
          /> : null:
          null
        }
      </div>
    </div>
  );
};


ReactDOM.render(<Index/>, document.getElementById("root"));



//The function is here only for testing
function setInitialEpochs(life) {
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
