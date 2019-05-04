import React from 'react';
import { Button, Icon } from 'antd';

export default function LoginButton({ handleClick }) {
  return (
    <Button 
      id='login-button'  
      size='small' 
      type='primary'
      onClick={handleClick}
    >
      <Icon type="facebook" theme="filled" />Log In
    </Button>
  );
}