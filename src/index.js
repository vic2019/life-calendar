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

if (window.screen.width < 1000) {
  message.info("For a better user experience, please consider visiting this site on a computer :)", 9);
}

const url = 'https://eo97n47fz6.execute-api.us-west-1.amazonaws.com/default/updateLifeCalendar';

function Index() {
  const [userInfo, setUserInfo] = useState({ name: '', gender: '' });
  const [life, setLife] = useState(test);
  const [epochs, setEpochs] = useState(setInitialEpochs(life));
  const [user, setUser] = useState(undefined);


  const [FB, setFB] = useState(undefined);

  document.addEventListener('FBObjectReady', () => setFB(window.FB));

  function handleFbLogin(res) {
    if (res.status === 'connected') {
      new Promise( (resolve, reject) => {
        FB.api(
          '/'+res.authResponse.userID,
          'GET',
          {"fields":"id,first_name,middle_name,last_name"},
          res => resolve(res)
        );  
      })
      .then( res => {
        return { 
          old: getData(res.id).then(data => DataTransfer),
          new: res
        };
      })
      .then( res => {
        if (!res.old.UserID) {
          setUser(res.new);
          postData({
            UserID: res.new.id,
            loginStatus: true,
            FbInfo: {
              "firstName": res.new.first_name,
              "middleName": res.new.middle_name,
              "lastName": res.new.last_name
            }
          });
        } else {
          if (res.old.loginStatus) {
            setUser(res.new);
            loginNotice(res.new);
          } else {
            updateData({
              Key: { "UserID": res.new.id },
              UpdateExpression: "set #f = :f",
              ExpressionAttributeNames: {
                "#f": "FbInfo",
              },
              ExpressionAttributeValues: {
                ":f": {
                  "firstName": res.new.first_name,
                  "middleName": res.new.middle_name,
                  "lastName": res.new.last_name     
                }
              }
            });
          }

        }
      });
    
    } else {
      setUser(undefined);
    }
  }
  

  function handleLoginBtnClick() {
    FB.login(handleFbLogin);
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

  function getData(id) {
    return axios.get(url + `?UserID=${id}`, {
      headers: { 
        "x-api-key": "l6PXzRC1LZ22bNW0VoQrg9XkdPMO6h51120XwpO4",
        "Content-Type": "application/json"
      }
    });
  }

  function updateData(params) {
    axios.put(url, {
      headers: { 
        "x-api-key": "l6PXzRC1LZ22bNW0VoQrg9XkdPMO6h51120XwpO4",
        "Content-Type": "application/json"
      },
      body: params
    });
  }

  function postData(data) {
    axios.post(url, {
      headers: { 
        "x-api-key": "l6PXzRC1LZ22bNW0VoQrg9XkdPMO6h51120XwpO4",
        "Content-Type": "application/json"
      },
      body: data
    });
  }

  function logout() {
    setUser(undefined);
    message.success("Logout success!", 3);
  }

  function deleteData() {

  }

  useEffect(() => {
    if(!FB) return;
    FB.getLoginStatus(handleFbLogin);
  }, [FB]);

  return (
    <div className='MainContainer'>   
      <div className='App'>
        <UserInfo setUserInfo={setUserInfo} setLife={setLife}/>
        <Calendar life={life} epochs={epochs} setEpochs={setEpochs}/>
        {life.lifespan? user? 
          <ActionButtons
            saveData={putData}
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
