import React from 'react';
import { Button } from 'antd';

export default function ActionButtons({ saveData, logout, deleteData, name }) {
  return (
    <Button.Group size='small' className='ActionButtons'>
      <Button type='primary' onClick={saveData}>Save</Button>
      <Button type='primary' onClick={logout}>
        {name? `Logout as ${name}`: 'Logout'}
      </Button>
      <Button type='danger' onClick={deleteData}>Delete</Button>
    </Button.Group>
  );
}