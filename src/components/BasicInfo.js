import React from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';


const { Option } = Select;

class BasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.setUserInfo = props.setUserInfo;
    this.setUserInfo.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        const { name, gender, birthday, lifespan } =     
          this.props.form.getFieldsValue([
            'name', 'gender', 'birthday', 'lifespan'
          ]);
          
        this.setUserInfo({
          name: name,
          gender: gender,
          birthday: birthday,
          lifespan: parseInt(lifespan),
          duration: parseInt(lifespan) * 52
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className='BasicInfo'>
        <Form className='Form' layout='inline'>
          <div className='row-wrapper'>
            <Form.Item>
              {getFieldDecorator('name', {
                rules: [{
                  required: true, min: 1, whitespace: true, message: 'Please enter your name'
                }],
              })(
                <Input placeholder='Name' />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('gender', {
                rules: [{
                  required: true, message: 'Please select a gender'
                }],
              })(
                <Select
                  placeholder='Gender' 
                  //placehold would disappear if assign 'value'
                  style={{ width: '15em' }}
                >
                  <Option value='male'>Male</Option>
                  <Option value='female'>Female</Option>
                  <Option value='other'>Transgender/Non-Binary</Option>
                </Select>
              )}
            </Form.Item>
          </div>
          <div className='row-wrapper'>
            <Form.Item>
              {getFieldDecorator('birthday', {
                rules: [{
                  required: true, message: 'Please enter your birthday'
                }],
              })(
                <DatePicker
                  placeholder='Birthday (mm/dd/year)'
                  format={'MM/DD/YYYY'}
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('lifespan', {
                rules: [{
                  transform: value => parseInt(value), required: true, type: 'number', message: 'Try 78 for the average American'
                }],
              })(
                <Input
                  placeholder='Expected Lifespan (years)'
                />
              )}
            </Form.Item>
          </div>
          <div className='row-wrapper'>
            <Form.Item>
              <Button onClick={this.handleSubmit}>Create My Calender!</Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  }
}

export default Form.create()(BasicInfo);