import React from 'react';
import { Button } from 'antd';

export default function ActionButtons({ save, logout, deleteUser, user }) {
  return (
    <Button.Group size='small' className='ActionButtons'>
      <Button type='primary' onClick={save}>Save</Button>
      <Button type='primary' onClick={logout}>
        {user.first_name? `Log out as ${user.first_name}`: 'Log Out'}
      </Button>
      <Button type='danger' onClick={deleteUser}>Delete</Button>
    </Button.Group>
  );
}