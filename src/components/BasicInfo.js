import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';


const Option = Select.Option;
const inputFieldWidth = { width: '14em' };

export default function BasicInfo({ userInfo, setUserInfo }) {
  const [name, setName] = useState(null);
  const [gender, setGender] = useState(null);
  const [birthday, setBirthday] = useState(null);
  const [lifespan, setLifespan] = useState(null);

  useEffect(() => {
    document.getElementById('test').innerHTML = `
    name: ${name} <Br> 
    gender: ${gender} <Br>  
    birthday: ${birthday}  <Br> 
    lifespan: ${lifespan}
    `
  });

  const handleSubmit = (ev) => {
    alert('submit!');

  };

  return (
    <div>
      <Form
        layout='inline'
      >
        <div>
          <Form.Item>
            <Input
              placeholder='Name'
              style={inputFieldWidth}
              value={name}
              onChange={(ev) => { setName(ev.target.value) }}
            />
          </Form.Item>
          <Form.Item>
            <Select
              placeholder='Gender' //placehold would disappear if assign value
              style={inputFieldWidth}
              onChange={(ev) => { setGender(ev) }} // Not ev.target.value
            >
              <Option value='male'>Male</Option>
              <Option value='female'>Female</Option>
              <Option value='trans'>Transgender/Non-Binary</Option>
            </Select>
          </Form.Item>
        </div>
        <div>
          <Form.Item>
            <DatePicker
              placeholder='Birthday'
              style={inputFieldWidth}
              onChange={(ev) => { setBirthday(ev) }} //ev is moment obj
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder='Lifespan in years'
              style={inputFieldWidth}
              value={lifespan}
              onChange={(ev) => { setLifespan(ev.target.value) }}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={handleSubmit}>
              <strong>Save</strong> 
            </Button>
          </Form.Item>
        </div>
      </Form>
      <p id="test"></p>
    </div>
  );
}