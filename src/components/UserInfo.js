import React from 'react';
import { Form, Input, Select, DatePicker, Button, Tooltip } 
  from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;


class BasicInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.setUserInfo = props.setUserInfo;
    this.setLife = props.setLife;

    this.handleSubmit = this.handleSubmit.bind(this);
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
        <div className='UserInfo'>
          <h1 className='Title'>
            Life Calendar:
          </h1>
          <h3 className='Subtitle' style={{
            textAlign: 'center', 
            color: '#555555', 
            padding: '0 0 12px 0'
          }}>
            Each tile represents two weeks of your life
          </h3> 
        <Form className='UserInfoForm' layout='inline'>  
          <div className='UserInfoRowWrapper'>
            <Form.Item>
              {getFieldDecorator('name', {
                rules: [{
                  required: true, min: 1, whitespace: true, message: 'Please enter your name'
                }]
              })(
                <Input 
                  placeholder='Name' 
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
                  style={inputStyle}
                >
                  <Option value='male'>Male</Option>
                  <Option value='female'>Female</Option>
                  <Option value='other'>Transgender/Non-Binary</Option>
                </Select>
              )}
            </Form.Item>
          </div>
          <div className='UserInfoRowWrapper'>
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
                />
              )}
            </Form.Item>
            <Form.Item>
              <Tooltip
                trigger={['focus']}
                title='Suggestion: Try 78 for the average American.'
                placement="topLeft"
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

                  />
                )}
              </Tooltip>
            </Form.Item>
          </div>
          <div className='UserInfoRowWrapper'>
            <Form.Item>
              <Button type='primary' style={buttonStyle} 
                onClick={this.handleSubmit}>
                Create My Calendar!
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  }
}

export default Form.create()(BasicInfo);


const inputStyle = {
  width: '17em',
}

const buttonStyle = {
  marginTop: '20px'
}