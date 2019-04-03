import React from 'react';

export default function BasicInfo({ userInfo, setUserInfo }) {

  return (
    <h1>{userInfo.bday}</h1>
  );
}