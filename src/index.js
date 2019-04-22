import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import UserInfo from './components/UserInfo';
import Calendar from './components/Calendar';
import LoginButton from './components/LoginButton';
import ActionButtons from './components/ActionButtons';
import { message } from 'antd';
import axios from 'axios';
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

const url = 'https://dhq1rkjlfl.execute-api.us-west-1.amazonaws.com/default/handleLifeCalendarReq';


if (window.screen.width < 1000) {
  message.info("For a better user experience, please consider visiting this site on a computer :)", 9);
}


function Index() {
  const [basicInfo, setBasicInfo] = useState({ name: '', gender: '' });
  const [life, setLife] = useState(test);
  const [epochs, setEpochs] = useState(setInitialEpochs(life));
  const [user, setUser] = useState(undefined);
  const [FB, setFB] = useState(undefined);

  document.addEventListener('FBObjectReady', () => setFB(window.FB));

  function handleFbLoginRes(userInitiated) {
    function handleFbLogin(res) {
      if (res.status === 'connected') {
        const queryUserFb = new Promise(resolve => {
          FB.api(
            '/'+res.authResponse.userID,
            'GET',
            {"fields":"id,first_name,middle_name,last_name"},
            res => resolve(res)
            );
          });
          
        const queryUserDb = getUser(res.authResponse.userID);
          
        Promise.all([queryUserFb, queryUserDb]).then( values => {
          const fbUser = values[0];
          const dbUser = values[1].data.Item;
            
          if (!dbUser) {
              createUser({
                UserID: fbUser.id,
                FbInfo: {
                  "firstName": fbUser.first_name,
                  "middleName": fbUser.middle_name,
                  "lastName": fbUser.last_name
                },
                loginStatus: true
              });
              loginNotice(fbUser);
          } else if (dbUser.logingStatus) {
              setUser(dbUser);
              loginNotice(fbUser);
              updateUser({
                Key: { "UserID": dbUser.UserID },
                UpdateExpression: "set #f = :f",
                ExpressionAttributeNames: {
                  "#f": "FbInfo",
                },
                ExpressionAttributeValues: {
                  ":f": {
                  "firstName": fbUser.first_name,
                  "middleName": fbUser.middle_name,
                  "lastName": fbUser.last_name   
                  }
                }
              });
            } else if (userInitiated) {
              setUser(dbUser);
              loginNotice(fbUser);
              updateUser({
                Key: { "UserID": dbUser.UserID },
                UpdateExpression: "set #f = :f",
                ExpressionAttributeNames: {
                  "#f": "FbInfo",
                },
                ExpressionAttributeValues: {
                  ":f": {
                  "firstName": fbUser.first_name,
                  "middleName": fbUser.middle_name,
                  "lastName": fbUser.last_name   
                  }
                }
              });

          } else {
            setUser(undefined);
          }
        });
      } else {
        setUser(undefined);
      }
    }

    return handleFbLogin;
  }

  

  function handleLoginBtnClick() {
    FB.login(handleFbLoginRes);
  }
  
  function loginNotice(user) {
    message.success(
      <span>
        {`Logged in as ${user.first_name} ${user.last_name}`}<br/><br/>
        <img 
          src={`http://graph.facebook.com/${user.id}/picture?type=normal`}
          alt=''
        />
      </span>, 
      4
    );
  }


  function getUser(id) {
    return axios.get(url + `?UserID=${id}`);
  }
  
  function createUser(data) {
    return axios.post(
      url, 
      { headers: { "Content-Type": "application/json" } },
      { data: data }
    );
  }

  function updateUser(params) {
    return axios.put(
      url, 
      { headers: { "Content-Type": "application/json" } },
      { data: params }
    );
  }

  function deleteUser(id) {
    return axios.delete(url + `?UserID=${id}`);
  }

  function logout() {
    setUser(undefined);
    message.success("Logout success!", 3);
  }


  useEffect(() => {
    if(!FB) return;
    FB.getLoginStatus(handleFbLoginRes);
  }, [FB]);


  return (
    <div className='MainContainer'>   
      <div className='App'>
        <UserInfo setBasicInfo={setBasicInfo} setLife={setLife}/>
        <Calendar life={life} epochs={epochs} setEpochs={setEpochs}/>
        {FB? user? 
          <ActionButtons
            // saveData={saveData}
            logout={logout}
            // deleteData={deleteData}
            name={user.fbUser? user.fbUser.first_name: null}
          /> :
          <LoginButton
            handleClick={handleLoginBtnClick}
          /> :
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
