import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { MyTag } from './MyComponents';
import uuidv4 from 'uuid/v4';
import dayjs from 'dayjs';


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
    const { visible, onCancel, onCreate, onDelete, form, selectedEpoch } 
    = this.props;
    const { getFieldDecorator } = form;
    const { title, description, color } = selectedEpoch.current?
      selectedEpoch.current: {title: '', description: '', color: ''};


    return (
      <Modal
        visible={visible}
        title={'Create a new life stage'}
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
                }], initialValue: title
              })(
          <Input
            placeholder='Title'
            style={{ width: '24em' }} 
            onPressEnter={this.focusNext}
          />
        )}
        </Form.Item>
        <Form.Item name='description'>
        {getFieldDecorator( 'description', 
        {validateTrigger: 'onSubmit', initialValue: description})(
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
        {selectedEpoch.current?
          <Form.Item>
            <Button type='danger' onClick={onDelete}>Delete</Button>
          </Form.Item>
          :null
        }
      </Form>
      </Modal>
    );
  }  
}

const WrappedEpochForm = Form.create()(EpochForm);



export default function InputEpoch(props) {
  const { modal, setModal, epochs, setEpochs, selectedEpoch, selectedPeriod } 
    = props;
  let wrappedFormRef;

  const handleCancel = () => {
    setModal(false);
    selectedPeriod.current = undefined;
    wrappedFormRef.props.form.resetFields();

  };

  const handleCreate = () => {
    setModal(false);
    
    const form = wrappedFormRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      let newEpoch = {
        title: values.title.trim(),
        description: (values.description || '').trimRight(),
        color: values.color,
        start: selectedPeriod.current.start,
        end: selectedPeriod.current.end,
        uuid: selectedEpoch.current?
        selectedEpoch.current.uuid: uuidv4()
      }
      
      let updatedEpochs = epochs;
      if (selectedEpoch.current) {
        updatedEpochs = epochs.filter( epoch => {
          return selectedEpoch.current.uuid !== epoch.uuid;
        });
      }
      
      updatedEpochs.push(newEpoch);
      setEpochs(updatedEpochs);

      selectedPeriod.current = undefined;
      form.resetFields();
    });
  };

  const handleDelete = () => {
    const updatedEpochs = epochs.filter( epoch => {
      return selectedEpoch.current.uuid !== epoch.uuid;
    });
    
    setEpochs(updatedEpochs);
    setModal(false);
    selectedPeriod.current = undefined;
    wrappedFormRef.props.form.resetFields();
  };

  const passFormRef = formRef => {
    wrappedFormRef = formRef;
  }

  return (
      <WrappedEpochForm 
        wrappedComponentRef={passFormRef}
        visible={modal}
        onCancel={handleCancel}
        onCreate={handleCreate}
        onDelete={handleDelete}
        selectedEpoch={selectedEpoch}
      />
  );
}