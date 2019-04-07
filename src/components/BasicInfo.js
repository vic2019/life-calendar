import React from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import moment from 'moment';


const { Option } = Select;

class BasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.setUserInfo = props.setUserInfo;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.focusNext = this.focusNext.bind(this);
    this.fields = Array(3).fill().map( (_, i) => React.createRef() );
  }

  focusNext(index) {
    return () => {
      if (index === 3) {
        this.fields[2].current.blur();
        return;
      }
      setTimeout( () => {this.fields[index].current.focus()}, 0);
    }
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        const { name, gender, birthday, lifespan } =     
          this.props.form.getFieldsValue([
            'name', 'gender', 'birthday', 'lifespan'
          ]);
        
        this.setUserInfo({
          name: name.trim(),
          gender: gender,
          birthday: birthday,
          lifespan: parseInt(lifespan),
          startOfWeek: moment(birthday).startOf('week'),
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
                <Input 
                  placeholder='Name' 
                  onPressEnter={this.focusNext(0)} 
                />
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
                  onChange={this.focusNext(1)}
                  ref={this.fields[0]}   
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
                  onChange={this.focusNext(2)}
                  ref={this.fields[1]}
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('lifespan', {
                rules: [{
                  transform: value => parseInt(value), required: true, type: 'number', message: 'Ex. 78 for the average American'
                }],
              })(
                <Input
                  placeholder='Expected Lifespan (years)'
                  onPressEnter={this.focusNext(3)}
                  ref={this.fields[2]}
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