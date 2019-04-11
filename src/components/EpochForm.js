import React from 'react';
import { Modal, Form, Input } from 'antd';
import { MyTag } from './MyComponents';


class EpochForm extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.descriptionRef = React.createRef();
  }

  focusNext = (e) => {
    e.preventDefault();
    this.field.current.focus();
  }

  handleSelectColor = (value) => {
    this.props.form.setFieldsValue({color: value});
  }

  render() {

    const { visible, onCancel, onCreate, form} = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        visible={visible}
        title='Create a new life stage'
        okText='Save'
        onCancel={onCancel}
        onOk={onCreate}
      >
      <Form className='EpochInfo' layout='vertical' hideRequiredMark={true}>
        <Form.Item>
        {getFieldDecorator('title', {
                rules: [{
                  required: true, min: 1, whitespace: true, 
                  message: 'A title is required'
                }],
              })(
          <Input 
            placeholder='Title' 
            style={{ width: '70%' }} 
            onPressEnter={this.focusNext}
          />
        )}
        </Form.Item>
        <Form.Item name='description'>
        {getFieldDecorator( 'description', 
        {validateTrigger: 'onSubmit'})(
          <Input.TextArea
            autosize={{ minRows: 5 }}
            placeholder='Description' 
            ref={this.descriptionRef}
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
          {/* This invisible input elem is for antd's form validadtor */}
          {getFieldDecorator('color', {
            rules: [{
              required: true, 
              message: 'Pick a color!'
            }],
          })(
            
                <input style={{display: 'none' }}/>      
          )}
        </Form.Item>
      </Form>
      </Modal>
    );
  }  
}

export default Form.create()(EpochForm);