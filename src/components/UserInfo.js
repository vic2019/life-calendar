import React from 'react';
import { Form, Input, Select, DatePicker, Button, Tooltip } from 'antd';
import dayjs from 'dayjs';


const { Option } = Select;

class BasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.setUserInfo = props.setUserInfo;
    this.setLife = props.setLife;

    this.handleSubmit = this.handleSubmit.bind(this);

    this.gender = React.createRef();
    this.DOB = React.createRef();
    this.lifespan = React.createRef();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.setUserInfo({
        name: values.name.trim(),
        gender: values.gender
      });
      
      const lifespan = parseInt(values.lifespan);
      this.setLife({
        DOB: dayjs(values.DOB.format()),
        lifespan: lifespan <= 100 ? lifespan: 100,
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
        <Form className='BasicInfo' layout='inline' style={basicInfoStyle}>
          <div className='row-wrapper' style={rowWrapperStyle}>
            <h3>Each square represents two weeks of your life
            </h3>
          </div>
          <div className='row-wrapper' style={rowWrapperStyle}>
            <Form.Item>
              {getFieldDecorator('name', {
                rules: [{
                  required: true, min: 1, whitespace: true, message: 'Please enter your name'
                }]
              })(
                <Input 
                  placeholder='Name' 
                  onPressEnter={()=>this.gender.current.focus()} 
                  style={inputStyle}
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('gender', {
                rules: [{
                  required: true, message: 'Please select a gender'
                }]
              })(
                <Select
                  placeholder='Gender' 
                  //placehold would disappear if assign 'value'
                  style={inputStyle}
                  onChange={()=>this.DOB.current.focus()}
                  onPressEnter={() => {
                    if (this.gender.current.value === undefined) return;
                    this.DOB.current.focus();
                  }}
                  ref={this.gender} 
                >
                  <Option value='male'>Male</Option>
                  <Option value='female'>Female</Option>
                  <Option value='other'>Transgender/Non-Binary</Option>
                </Select>
              )}
            </Form.Item>
          </div>
          <div className='UserInfoRowWrapper' style={rowWrapperStyle}>
            <Form.Item>
              {getFieldDecorator('DOB', {
                rules: [{
                  required: true, message: 'Please enter your date of birth'
                }],
              })(
                <DatePicker
                  placeholder='Date of Birth (mm/dd/year)'
                  style={inputStyle}
                  format={'MM/DD/YYYY'}
                  onOpenChange={()=> {
                    setTimeout(()=>this.lifespan.current.focus(), 0);
                  }}
                  ref={this.DOB}
                />
              )}
            </Form.Item>
            <Form.Item>
              <Tooltip
                trigger={['focus']}
                title='Suggestion: Try 78 for the average American.'
                placement="topLeft"
                mouseEnterDelay={1}
              >
                {getFieldDecorator('lifespan', {
                  rules: [{
                    transform: (value) => {
                      value = Math.floor(value);
                      return value > 0 ? value : NaN;
                    },
                    type: 'number',
                    message: 'Please enter a positive number'
                  }]
                })(
                  <Input
                    placeholder='Expected Lifespan (years)'
                    style={inputStyle}                    
                    ref={this.lifespan}
                    onPressEnter={this.handleSubmit}
                  />
                )}
              </Tooltip>
            </Form.Item>
          </div>
          <div className='UserInfoRowWrapper' style={rowWrapperStyle}>
            <Form.Item>
              <Button onClick={this.handleSubmit}>Create My Calendar!</Button>
            </Form.Item>
          </div>
        </Form>
    );
  }
}

export default Form.create()(BasicInfo);

const basicInfoStyle = {
  display: 'flex',
  flexFlow: 'column wrap',
  alignItem: 'center',
  marginTop: '24px',
  marginLeft: '16px' //To offset the margin-right of .ant-form-item
}

const rowWrapperStyle = {
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'center',
}

const inputStyle = {
  width:'17em'
}

