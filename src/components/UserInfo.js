import React from 'react';
import { Form, Input, Select, DatePicker, Button, notification } from 'antd';
import dayjs from 'dayjs';


const { Option } = Select;

// Inline style is needed for this antd component
const inputStyle = {
  width: '240px',
}

const buttonStyle = {
  marginTop: '20px'
}


class BasicInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.setBasicInfo = props.setBasicInfo;
    this.setLife = props.setLife;
    this.state = { explanationOpen: false };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.setBasicInfo({
        name: values.name.trim(),
        gender: values.gender
      });
      
      const lifespan = parseInt(values.lifespan);
      this.setLife({
        DOB: dayjs(values.DOB.format()),
        lifespan: lifespan < 100 ? lifespan: 99,
      });
    });
  }

  reminder = () => {
    this.setState({ explanationOpen: false });
    if (window.localStorage.getItem('loggedIn')) return;

    notification.open({
      duration: 4,
      message: 'Log in before editing to save your changes.'
    });
  }

  explanation = () => {
    if (this.state.explanationOpen) return;

    this.setState({ explanationOpen: true });
    notification.open({
      duration: 0,
      message: 'What is a Life Calendar?',
      onClose: this.reminder,
      description: <div>
      <p>A <b>Life Calendar</b> is a visual representation that helps us see how a person's entire life is an accumulation of small droplets of time. Two weeks are a relatively short period of time. A busy person could easily have tasks or appointments scheduled two weeks into the future. However, as shown by a Life Calendar, although one may have many two-week periods throughout his lifetime, their number is not infinite.</p>
      
      <p>Reflecting upon one’s mortality and life’s finiteness has been a spiritual practice for philosophers in the Ancient Greece, Rome, India, and civilizations around the world. Remembering that our time is limited teaches us humility and appreciation. With the right mindset, it helps create priority and clarity of purpose.</p>
      
      <p>“<i>Let us prepare our minds as if we’d come to the very end of life. Let us postpone nothing. … The one who puts the finishing touches on their life each day is never short of time.</i>”  -Seneca</p>
      </div>
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
        <div id='user-info'>
          <h1 id='page-title'>
            Life Calendar:
          </h1>
          <h3 id='subtitle'>
            Each tile represents two weeks of your life
            <span id='explanation' onClick={this.explanation}>
              (Why?)
            </span>
          </h3>
        <Form id='user-info-form' layout='inline'>  
          <div className='user-info-row-wrapper'>
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
                  <Option value='nonbinary'>Non-Binary</Option>
                </Select>
              )}
            </Form.Item>
          </div>
          <div className='user-info-row-wrapper'>
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
            </Form.Item>
          </div>
          <div className='user-info-row-wrapper'>
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