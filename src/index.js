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





const defaultLife = {
  DOB: dayjs(),
  lifespan: 0
};

// const test = {
//   DOB: dayjs('1990-04-16'),
//   lifespan: 100
// };

const url = 'https://dhq1rkjlfl.execute-api.us-west-1.amazonaws.com/default/handleLifeCalendarReq';


if (window.screen.width < 1000) {
  message.info("For a better user experience, please consider visiting this site on a computer :)", 9);
}


function Index() {
  const [basicInfo, setBasicInfo] = useState({ name: '', gender: '' });
  const [life, setLife] = useState(defaultLife);
  const [epochs, setEpochs] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [FB, setFB] = useState(undefined);

  document.addEventListener('FBObjectReady', () => setFB(window.FB));

  function handleFbLogin(loginButtonClick) {
    return (res) => {
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
          
          if (!fbUser.id) {
            handleLoginBtnClick();
            return;
          }
                    
          if (dbUser && (dbUser.loginStatus || loginButtonClick) ) {
            updateUser({
              Key: { "UserID": dbUser.UserID },
              UpdateExpression: "set #a = :a, #b = :b",
              ExpressionAttributeNames: {
                "#a": "FbInfo",
                "#b": "loginStatus"
              },
              ExpressionAttributeValues: {
                ":a": {
                "firstName": fbUser.first_name,
                "middleName": fbUser.middle_name,
                "lastName": fbUser.last_name   
                },
                ":b": true
              }
            });

            loadData(dbUser);
            
          } else if (!dbUser && loginButtonClick) {
            createUser({
              UserID: fbUser.id,
              FbInfo: {
                "firstName": fbUser.first_name,
                  "middleName": fbUser.middle_name,
                  "lastName": fbUser.last_name
                },
              loginStatus: true
            }); 

          } else {
            setUser(undefined);
            return;
          }
          
          setUser(fbUser);
          loginNotice(fbUser);
        });
      } else {
        setUser(undefined);
      }
    };
  }

  function handleLoginBtnClick() {
    FB.login(handleFbLogin(true));
  }
  
  function loginNotice(user) {
    message.success(
      <span>
        {`Logged in as ${user.first_name} ${user.last_name}`}<br/><br/>
        <img 
          src={`http://graph.facebook.com/${user.id}/picture?type=large`}
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
      // Config comes AFTER data. And it's "data," not "body"
      // Do NOT put { data: data }
      data, 
      { headers: { "Content-Type": "application/json" } }
    );
  }

  function updateUser(params) {
    return axios.put(
      url, 
      params,
      { headers: { "Content-Type": "application/json" } }
    );
  }

  function deleteUser() {
    setUser(undefined);
    return axios.delete(url + `?UserID=${user.id}`);
  }

  function logout() {
    updateUser({
      Key: { "UserID": user.id },
      UpdateExpression: "set #a = :a",
      ExpressionAttributeNames: {
        "#a":  "loginStatus"
      },
      ExpressionAttributeValues: {
        ":a": false
      }
    })
    setUser(undefined);
    message.success("Logout success!", 3);
  }

  function saveData() {
    alert(`${life.DOB} ${basicInfo.name} ${epochs[epochs.length - 1].title}`);
    
    updateUser({
      Key: { "UserID": user.id },
      UpdateExpression: "set #a = :a, #b = :b, #c = :c, #d = :d",
      ExpressionAttributeNames: {
        "#a": "life",
        "#b": "epochs",
        "#c": "name",
        "#d": "gender"
      },
      ExpressionAttributeValues: {
        ":a": life,
        ":b": epochs,
        ":c": basicInfo.name,
        ":d": basicInfo.gender
      }
    })
  }

  function loadData(dbUser) {
    if(!dbUser || !user || !user.id) return;

    setLife({
      DOB: dayjs(dbUser.life.DOB),
      lifespan: dbUser.life.lifespan
    });

    setEpochs(...dbUser.epochs.map( item => {
      return {
        uuid: item.uuid,
        title: item.title,
        note: item.note || '',
        color: item.color,
        start: dayjs(item.start),
        end: dayjs(item.end)
      };
    }))

    setBasicInfo({
      name: dbUser.basicInfo.name,
      gender: dbUser.basicInfo.gender
    });

  }

  useEffect(() => {
    if(!FB) return;
    FB.getLoginStatus(handleFbLogin(false));
  }, [FB]);


  return (
    <div className='MainContainer'>   
      <div className='App'>
        <UserInfo setBasicInfo={setBasicInfo} setLife={setLife}/>
        <Calendar life={life} epochs={epochs} setEpochs={setEpochs}/>
        {FB? user? 
          <ActionButtons
            saveData={saveData}
            logout={logout}
            deleteUser={deleteUser}
            user={user}
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
// function setInitialEpochs(life) {
//   const birthWeek = life.DOB.startOf('week');
//   const fallAt7Years = birthWeek.startOf('year').add(7*52 + 34, 'week');
//   const springAt12Years = birthWeek.startOf('year').add(12*52 + 26, 'week');
//   const fallAt12Years = springAt12Years.add(8, 'week');
//   const springAt18Years = birthWeek.startOf('year').add(18*52 + 26, 'week');

//   function getFutureWeek(birthWeek, futureDate) {
//     const diffInWeeks = Math.floor(
//       futureDate.diff( birthWeek, 'week' ) / 2
//     ) * 2;

//     return birthWeek.add(diffInWeeks, 'week');
//   } 
  
//   const childhood = {
//     uuid: uuidv4(),
//     title: 'Early Childhood',
//     start: birthWeek,
//     end: birthWeek.add(6 * 52, 'week'),
//     color: '#FFC0CB'
//   };
    
//   const gradeschool = {
//     uuid: uuidv4(),
//     title: 'Grade School',
//     start: getFutureWeek(birthWeek, fallAt7Years).add(2, 'week'),
//     end: getFutureWeek(birthWeek, springAt12Years),
//     color: '#c39bd3'
//   };
  
//   const highschool = {
//     uuid: uuidv4(),
//     title: 'Middle & High School',
//     start: getFutureWeek(birthWeek, fallAt12Years).add(2, 'week'),
//     end: getFutureWeek(birthWeek, springAt18Years),
//     color: '#7fb3d5'
//   }
  
//   const future = {
//     uuid: 'the future',
//     title: 'The Future',
//     start: dayjs(),
//     end: birthWeek.add(101, 'year'),
//     color: '#fff59d'
//   };

//   return [childhood, gradeschool, highschool, future];
// }
