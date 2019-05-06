import axios from 'axios';
import { CognitoAuth } from 'amazon-cognito-auth-js';
import { AUTH_DATA, DB_URI, SORT_KEY } from '../config/config';


export const auth = new CognitoAuth(AUTH_DATA);

// Return User obj to communicate with backend
export const User = (hash) => {
  const idToken = parseHashParams(hash, 'id_token');
  if (!idToken) return undefined;

  const accessToken = parseHashParams(hash, 'access_token');
  const payload = JSON.parse(window.atob(idToken.split('.')[1]));
  const id = payload['cognito:username'];
  const provider = payload.identities? 
    payload.identities[0].providerName: undefined;
  const socialId = payload.identities? payload.identities[0].userId: undefined;
  const socialName = payload.socialname;
  const email = payload.email;
  const socialToken = payload.profile;
  const credential = { "Authorization": idToken };

  const get = () => {
    return axios.get(DB_URI + `?${SORT_KEY}=${id}`, { headers: credential });
  };

  const save = (params) => {
    params[SORT_KEY] = id;
    return axios.put(
      DB_URI, 
      params,
      { 
        headers: { 
          "content-type": "application/json", 
          ...credential
        } 
      }
    );
  };
  
  const deleteUser = () => {
    return axios.delete(DB_URI + `?${SORT_KEY}=${id}`, { headers: credential });
  };

  return {
    idToken,
    accessToken,
    id,
    provider,
    socialId,
    socialName,
    socialToken,
    email,
    get,
    save,
    deleteUser
  };
};

const parseHashParams = (hash, paramType) => {
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
