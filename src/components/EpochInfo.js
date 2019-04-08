import React from 'react';
import { Form, Input, Button, Radio } from 'antd';
import { MyTag } from './MyComponents';

const { TextArea } = Input;

const titleStyle = {
  width: '300px'
}

const descriptionStyle = {
  width: '450px'
}

const containerStyle ={
  padding: '50px'
}

const buttonStyle = {
  width: '6em'
}

class EpochInfo extends React.Component {
  constructor(props) {
    super(props);
    this.setEpochs = props.setEpochs
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSelectColor = this.handleSelectColor.bind(this);
    this.focusNext = this.focusNext.bind(this);
    this.field = React.createRef();
    this.state = { color: undefined };
  }

  focusNext(e) {
    e.preventDefault();
    this.field.current.focus();
  }

  handleSelectColor(value) {
    this.setState({ color: value });
  }

  handleCancel(e) {

  }

  handleSubmit(e) {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        let { title, description } =     
          this.props.form.getFieldsValue(['title', 'description']);

        this.setEpochs( epochs => {
          return [...epochs, {
            title: title.trim(),
            description: description.trimRight(),
            color: this.state.color,
            start: 7*52,
            end: 9*52
          }];
        });

      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div style={containerStyle}>
      <p style={{fontSize:'16px'}}>Create a life event (or an <em>epoch</em>)</p>
      <Form className='EpochInfo' layout='horizontal'>
        <Form.Item>
        {getFieldDecorator('title', {
                rules: [{
                  required: true, min: 1, whitespace: true, 
                  message: 'A title is required'
                }],
              })(
          <Input 
            placeholder='Title' 
            style={titleStyle} 
            onPressEnter={this.focusNext}
          />
        )}
        </Form.Item>
        <Form.Item name='description'>
        {getFieldDecorator('description', {validateTrigger: 'onSubmit'})(
          <TextArea
            autosize={{ minRows: 7 }}
            placeholder='Description' 
            style={descriptionStyle}
            ref={this.field}
          />
        )}
        </Form.Item>
        <Form.Item  label='Color:'>
          <MyTag 
            color='gold' 
            value='gold' 
            onChecked={this.handleSelectColor}
          >
            gold
          </MyTag>
          <MyTag 
            color='magenta' 
            value='magenta' 
            onChecked={this.handleSelectColor}
          >
            magenta
          </MyTag>
          <MyTag 
            color='cyan' 
            value='cyan' 
            onChecked={this.handleSelectColor}
          >
            cyan
          </MyTag>
          <MyTag 
            color='red' 
            value='red' 
            onChecked={this.handleSelectColor}
          >
            red
          </MyTag>
          <MyTag 
            color='green' 
            value='green' 
            onChecked={this.handleSelectColor}
          >
            green
          </MyTag>
          <MyTag 
            color='purple' 
            value='purple' 
            onChecked={this.handleSelectColor}
          >
            purple
          </MyTag>
        </Form.Item>
        <Form.Item>
          <Button style={buttonStyle} onClick={this.handleCancel}>Cancel</Button>
          <Button style={buttonStyle} onClick={this.handleSubmit}>Save</Button>
        </Form.Item>
      </Form>
      </div>
    );
  }  
}

export default Form.create()(EpochInfo);