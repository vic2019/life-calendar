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
  const [epochs, setEpochs] = useState([]);
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
            return setTimeout(() => FB.login(handleFbLogin(true)), 0);
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
          loadData(dbUser);
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
        {`Logged in as ${user.first_name} ${user.last_name}`}<br/>
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
    setLife(defaultLife);
    setBasicInfo({ name: '', gender: ''});
    setEpochs([]);  
    return axios.delete(url + `?UserID=${user.id}`).then( (_, err) => {
      if (!err) message.success('User account deleted', 3);
    })
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
    }).then( (_, err) => {
      if (!err) message.success("Logout success!", 3);
    })
    setUser(undefined);
    setLife(defaultLife);
    setBasicInfo({ name: '', gender: ''});
    setEpochs([]);
  }

  function saveData() {
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
    }).then( (_, err) => {
      if (!err) message.success('Saved!', 3);
    });
  }

  function loadData(dbUser) {
    if(!dbUser) return;

    if (dbUser.life) {
      setLife({
        DOB: dayjs(dbUser.life.DOB),
        lifespan: dbUser.life.lifespan
      });
    }

    if (dbUser.epochs) {
      setEpochs([...dbUser.epochs.map( item => {
        return {
          uuid: item.uuid,
          title: item.title,
          note: item.note || '',
          color: item.color,
          start: dayjs(item.start),
          end: dayjs(item.end)
        };
      })])
    }

    if (dbUser.name && dbUser.gender) {
      setBasicInfo({
        name: dbUser.name,
        gender: dbUser.gender
      });
    }
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