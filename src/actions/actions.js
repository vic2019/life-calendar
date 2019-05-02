import axios from 'axios';
import { CognitoAuth } from 'amazon-cognito-auth-js';
import { AUTH_DATA, DB_URI, SORT_KEY } from '../config/config';


export const auth = new CognitoAuth(AUTH_DATA);

export const User = (hash, savedIdToken, savedAccessToken) => {
  const idToken = savedIdToken? savedIdToken: parseHashParams(hash, 'id_token');
  if (!idToken) return undefined;

  const accessToken = savedAccessToken? 
    savedAccessToken: parseHashParams(hash, 'access_token');
  const id = JSON.parse(window.atob(idToken.split('.')[1]))['cognito:username'];
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
    alert('oh');

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
    idToken,
    accessToken,
    id,
    fbId,
    get,
    update,
    deleteUser,
    // showId
  };
};

export const parseHashParams = (hash, paramType) => {
  const reg = new RegExp(`${paramType}=[\\w.-]*&?`);
  const match = hash.match(reg);
  let token = match? match[0]: undefined;
  
  if (!token) {
    return token;
  } else if (token[token.length - 1] === '&') {
    token = token.slice(paramType.length + 1, token.length - 1);
  } else {
    token = token.slice(paramType.length + 1, token.length);
  }
  
  return token;
};
