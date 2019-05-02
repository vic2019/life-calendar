import axios from 'axios';
import { CognitoAuth } from 'amazon-cognito-auth-js';
import { AUTH_DATA, DB_URI, SORT_KEY } from '../config/config';


export const auth = new CognitoAuth(AUTH_DATA);

export const User = (idToken) => {
  const id = JSON.parse(window.atob(idToken.split('.')[1]))['cognito:username'];
  const fbToken = JSON.parse(window.atob(idToken.split('.')[1]))['custom:FB_access_token'];
  const fbId = id.includes('Facebook')? id.slice(9, id.length): undefined;
  const credential = { "Authorization": idToken };

  const get = () => {
    return axios.get(DB_URI + `?${SORT_KEY}=${id}`, { headers: credential });
  };

  const update = (params) => {
    const keys = Object.keys(params);
    let UpdateExpression = 'set';
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};
    for (let key of keys) {
      UpdateExpression += ` #${key} = :${key},`;
      ExpressionAttributeNames['#'+key] = key;
      ExpressionAttributeValues[':'+key] = params[key];
    }
    UpdateExpression = UpdateExpression.slice(0, UpdateExpression.length - 1);

    return axios.put(
      DB_URI, 
      {
        Key: { [SORT_KEY]: id },
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues
      },
      { headers: { 
        "content-type": "application/json", 
        ...credential
      } }
    );
  };
  
  const deleteUser = () => {
    return axios.delete(DB_URI + `?${SORT_KEY}=${id}`, { headers: credential });
  };

  // const showId = () => {
  //   window.alert(id);
  // }

  return {
    token: idToken,
    id,
    fbId,
    fbToken,
    get,
    update,
    deleteUser,
    // showId
  }
};

export const parseHashParams = (hash) => {
  const match = hash.match(/id_token=[\w-.]*&?/);
  let idToken = match.length? match[0]: undefined;
  
  if (!idToken) {
    return idToken;
  } else if (idToken[idToken.length - 1] === '&') {
    idToken = idToken.slice(9, idToken.length - 1);
  } else {
    idToken = idToken.slice(9, idToken.length);
  }
  
  return idToken;
};
