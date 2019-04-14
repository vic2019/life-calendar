import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { MyTag } from './MyComponents';
import uuidv4 from 'uuid/v4';


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
    const { visible, onCancel, onCreate, onDelete, form, 
      selectedEpoch, modalTitle } = this.props;
    const { getFieldDecorator } = form;
    const { title, description, color } = selectedEpoch.current?
      selectedEpoch.current: {title: '', description: '', color: ''};


    return (
      <Modal
        visible={visible}
        title={modalTitle}
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
        <Form.Item>
          <MyTag 
            color='#e74c3c'
            value='#e74c3c' 
            onChecked={this.handleSelectColor}
          >
            red
          </MyTag>
          <MyTag 
            color='#c39bd3' 
            value='#c39bd3' 
            onChecked={this.handleSelectColor}
          >
            purple
          </MyTag>
          <MyTag 
            color='#FFC0CB' 
            value='#FFC0CB' 
            onChecked={this.handleSelectColor}
          >
            pink
          </MyTag>
          <MyTag 
            color='#7fb3d5' 
            value='#7fb3d5' 
            onChecked={this.handleSelectColor}
          >
            blue
          </MyTag>
          <MyTag 
            color='#b3e5fc' 
            value='#b3e5fc' 
            onChecked={this.handleSelectColor}
          >
            sky
          </MyTag>
          <MyTag 
            color='#a9dfbf' 
            value='#a9dfbf' 
            onChecked={this.handleSelectColor}
          >
            green
          </MyTag>
          <MyTag 
            color='#f7dc6f' 
            value='#f7dc6f' 
            onChecked={this.handleSelectColor}
          >
            gold
          </MyTag>
          <MyTag 
            color='#f5b041' 
            value='#f5b041' 
            onChecked={this.handleSelectColor}
          >
            orange
          </MyTag>
          {/* This invisible input elem is for antd's form validadtor */}
          {getFieldDecorator('color', {
            rules: [{
              required: true, 
              message: 'Pick a color!'
            }], initialValue: color
          })(  
                <input style={{display: 'none' }}/>      
          )}
        </Form.Item>
        <Form.Item>
        {selectedEpoch.current?
          <Form.Item>
            <Button type='danger' onClick={onDelete}>Delete</Button>
          </Form.Item>
          :null
        }
        </Form.Item>
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
    selectedPeriod.current = undefined;
    wrappedFormRef.props.form.resetFields();
    setModal(false);
  };

  const handleCreate = () => {
    
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
      setModal(false);
    });
  };
  
  const handleDelete = () => {
    const updatedEpochs = epochs.filter( epoch => {
      return selectedEpoch.current.uuid !== epoch.uuid;
    });
    
    setEpochs(updatedEpochs);
    selectedPeriod.current = undefined;
    wrappedFormRef.props.form.resetFields();
    setModal(false);
  };
  
  const passFormRef = formRef => {
    wrappedFormRef = formRef;
  }

  const createModalTitle = () => {
    let modalTitle = 'Create a life stage';
    if (selectedPeriod.current) {
      modalTitle += ' for ' + 
      selectedPeriod.current.start.format('MMM D, YYYY') + ' to ' + 
      selectedPeriod.current.end.add(13, 'day').format('MMM D, YYYY');
    }

    return modalTitle;
  }

  
  return (
      <WrappedEpochForm 
        wrappedComponentRef={passFormRef}
        visible={modal}
        onCancel={handleCancel}
        onCreate={handleCreate}
        onDelete={handleDelete}
        selectedEpoch={selectedEpoch}
        modalTitle={createModalTitle()}
      />
  );
}