import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import UserInfo from './components/UserInfo';
import Calendar from './components/Calendar';
import LoginButton from './components/LoginButton';
import ActionButtons from './components/ActionButtons';
import { User, auth, parseHashParams } from './actions/actions';
import { message } from 'antd';
import dayjs from 'dayjs';
import "antd/dist/antd.css";
import "./index.css";


if (window.screen.width < 1000) {
  message.info("For a better user experience, please consider visiting this site on a computer :)", 8);
}


const initialLife = {
  DOB: dayjs(),
  lifespan: 0
};

// const testLife = {
  //   DOB: dayjs('1990-04-16'),
  //   lifespan: 100
  // };
  
function Index() {
  const [basicInfo, setBasicInfo] = useState({});
  const [life, setLife] = useState(initialLife);
  const [epochs, setEpochs] = useState([]);
  const [user, setUser] = useState(undefined);
  const FB = useRef(undefined);
  
  document.addEventListener('FBObjectReady', () => FB.current = window.FB);
  window.addEventListener('load', initUser);
    
  function initUser() {
    let idToken;
    const hash = window.location.hash;
    if (hash) {
      idToken = parseHashParams(hash);
      if (idToken) window.localStorage.clear();
    } else {
      idToken = window.localStorage.getItem('token');
    }

    if (!idToken) return;

    try {
      setUser(new User(idToken));
      window.localStorage.setItem('token', idToken);

    } catch(err) {
      if (!err) alert('login success');
    }
  }

  const importUserData = () => {
    user.get().then(res => {
      const saved = res.data.Item;
      if (!saved) return;

      setBasicInfo({
        name: saved.name,
        gender: saved.gender
      });

      setLife({
        DOB: dayjs(saved.DOB),
        lifespan: saved.lifespan
      });
      
      setEpochs([...saved.epochs.map( item => {
        return {
          uuid: item.uuid,
          title: item.title,
          note: item.note || '',
          color: item.color,
          start: dayjs(item.start),
          end: dayjs(item.end)
        };
      })]);
    })
  }

  const login = () => {
    auth.getSession();
  };

  const logout = () => {
    window.localStorage.clear();
    auth.signOut();
  };

  const deleteUser = () => {
    user.deleteUser();
    logout();
  }

  useEffect( () => {
    if (!user) return;

    importUserData();
    alert(user.fbToken)

    // if(FB.current && user.fbId) {
    //   FB.current.api(
    //     '/'+user.fbId,
    //     'GET',
    //     {"fields":"first_name,middle_name,last_name"},
    //     res => {
    //       alert(res.toString());
    //       // loginNotice(first_name, last_name);
    //       // user.update({
    //       //   "Fb_first_name": first_name,
    //       //   "Fb_middle_name": middle_name,
    //       //   "Fb_last_name": last_name
    //       // });
    //     }
      // );
    // }
  }, [user]);
  

  // function handleFbLogin(loginButtonClick) {
  //   return (res) => {
  //     if (res.status === 'connected') {
  //       const queryUserFb = new Promise(resolve => {
  //         FB.api(
  //           '/'+res.authResponse.userID,
  //           'GET',
  //           {"fields":"id,first_name,middle_name,last_name"},
  //           res => resolve(res)
  //         );
  //       });
        
  //       const queryUserDb = getUser(res.authResponse.userID);
        
  //       Promise.all([queryUserFb, queryUserDb]).then( values => {
  //         const fbUser = values[0];
  //         const dbUser = values[1].data.Item;
          
  //         if (!fbUser.id) {
  //           return setTimeout(() => FB.login(handleFbLogin(true)), 0);
  //         }
                    
  //         if (dbUser && (dbUser.loginStatus || loginButtonClick) ) {
  //           updateUser({
  //             Key: { "UserID": dbUser.UserID },
  //             UpdateExpression: "set #a = :a, #b = :b",
  //             ExpressionAttributeNames: {
  //               "#a": "FbInfo",
  //               "#b": "loginStatus"
  //             },
  //             ExpressionAttributeValues: {
  //               ":a": {
  //               "firstName": fbUser.first_name,
  //               "middleName": fbUser.middle_name,
  //               "lastName": fbUser.last_name   
  //               },
  //               ":b": true
  //             }
  //           });

  //         } else if (!dbUser && loginButtonClick) {
  //           createUser({
  //             UserID: fbUser.id,
  //             FbInfo: {
  //               "firstName": fbUser.first_name,
  //               "middleName": fbUser.middle_name,
  //               "lastName": fbUser.last_name
  //             },
  //             loginStatus: true
  //           }); 
            
  //         } else {
  //           setUser(undefined);
  //           return;
  //         }
          
  //         setUser(fbUser);
  //         loadData(dbUser);
  //         loginNotice(fbUser);
  //       });
  //     } else {
  //       setUser(undefined);
  //     }
  //   };
  // }

  // function handleLoginBtnClick() {
  //   FB.login(handleFbLogin(true));
  // }
  
  function loginNotice(firstName, lastName) {
    message.success(
      <span>
        {`Logged in as ${firstName} ${lastName}`}
        <br/>
        <img 
          src={`http://graph.facebook.com/${user.fbId}/picture?type=large`}
          alt=''
        />
      </span>, 
      3
    );
  }

  const save = () => {
    if (basicInfo.name === undefined) {
      message.info('Nothing new to save.', 3);
      return;
    }

    user.update({
      "name": basicInfo.name,
      "gender": basicInfo.gender,
      "DOB": life.DOB.toString(),
      "lifespan": life.lifespan,
      "epochs": epochs
    }).then( (_, err) => {
      if (!err) message.success('Saved!', 3);
    });
  }


  return (
    <div className='MainContainer'>   
      <div className='App'>
        <UserInfo setBasicInfo={setBasicInfo} setLife={setLife}/>
        <Calendar life={life} epochs={epochs} setEpochs={setEpochs}/>
        {user? 
          <ActionButtons
            save={save}
            logout={logout}
            deleteUser={deleteUser}
            user={user}
          /> :
          <LoginButton
            handleClick={login}
          /> 
        }
      </div>
    </div>
  );
};


ReactDOM.render(<Index/>, document.getElementById("root"));