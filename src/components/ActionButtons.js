import React from 'react';
import { Button } from 'antd';

export default function ActionButtons({ save, logout, deleteUser, user }) {
  return (
    <Button.Group size='small' id='action-buttons'>
      <Button type='primary' onClick={save}>Save</Button>
      <Button type='primary' onClick={logout}>
        {user.fbName? `Log out as ${user.fbName.split(' ')[0]}`: 'Log Out'}
      </Button>
      <Button type='danger' onClick={deleteUser}>Delete</Button>
    </Button.Group>
  );
}