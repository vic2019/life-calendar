import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import UserInfo from './components/UserInfo';
import Calendar from './components/Calendar';
import LoginButton from './components/LoginButton';
import ActionButtons from './components/ActionButtons';
import { User, auth } from './actions/actions';
import { message } from 'antd';
import dayjs from 'dayjs';
import "antd/dist/antd.css";
import "./index.css";


if (window.screen.width < 1000) {
  message.info("For better user experience, please consider visiting this site on a computer :)", 4);
}

const initialLife = {
  DOB: dayjs(),
  lifespan: 0
};

// const testLife = {
//     DOB: dayjs('1995-04-16'),
//     lifespan: 30
// };
  
function Index() {
  const [basicInfo, setBasicInfo] = useState({ name: ' ', gender: ' '});
  // ^ DynamoDB does not allow empty string
  const [life, setLife] = useState(initialLife);
  const [epochs, setEpochs] = useState([]);
  const [user, setUser] = useState(undefined);

  // Check if user is logged in on page load. 
  // Sync log-in status of all tabs through local storage
  window.addEventListener('load', initUser);
  window.addEventListener('storage', () => {
    const loggedIn = window.localStorage.getItem('loggedIn');
    if (!loggedIn && user) {
      auth.signOut();
    }
  });

  function initUser() {
    let currentUser;
    const loggedIn = window.localStorage.getItem('loggedIn');
    const hash = window.location.hash;
    if (hash && hash !== '#') {
      window.location = '#';
      currentUser = new User(hash);
    } else { 
      if(!loggedIn) return;
      auth.getSession();
      return;
    }

    if (!currentUser) {
      if (loggedIn) window.localStorage.clear();
      return;
    }

    setUser(currentUser);
    if (!loggedIn) window.localStorage.setItem('loggedIn', '1');
  }

  const importUserData = () => {
    user.get().then(res => {
      const saved = res.data.Item;
      if (!saved) return;

      setBasicInfo({
        name: saved.name || ' ',
        gender: saved.gender || ' ' 
      });

      setLife({
        DOB: dayjs(saved.DOB),
        lifespan: saved.lifespan || 0
      });
      
      setEpochs(saved.epochs.map( item => {
          return {
            uuid: item.uuid,
            title: item.title,
            note: item.note || ' ',
            color: item.color,
            start: dayjs(item.start),
            end: dayjs(item.end)
          };
        })
      );
    }).catch( err => {
      console.log(`Error: ${err}`);
    });
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
  
  const save = () => {
    user.save({
        UserID: user.id,
        name: basicInfo.name,
        gender: basicInfo.gender,
        DOB: life.DOB,
        lifespan: life.lifespan,
        epochs: epochs
      }).then( () => {
        message.success('Saved!', 2);
      }).catch( err => {
        message.error('An error occurred. Your changes are not saved', 2)
        console.log(err);
      })
    }
    
  const loginNotice = (fbName) => {
    message.success(
      <span>
        {`Logged in as ${fbName}`}
        <br/>
        <img
          className='login-notice-pic'
          src={`http://graph.facebook.com/${user.fbId}/picture?type=normal`}
          alt=''
        />
      </span>, 
      2
    );
  }

  // Import user data upon logging in
  useEffect( () => {
    if (!user) return;

    importUserData();
    setTimeout(()=> loginNotice(user.fbName), 500);

  }, [user]);
    

    return (
      <div className='main-container'>   
      <div className='app'>
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