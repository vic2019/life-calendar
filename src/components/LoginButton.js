import React from 'react';
import { Button, Icon } from 'antd';

export default function LoginButton({ handleClick }) {
  return (
    <Button 
      className='LoginButton'  
      size='small' 
      type='primary'
      onClick={handleClick}
    >
      <Icon type="facebook" theme="filled" />Log In & Save
    </Button>
  );
}