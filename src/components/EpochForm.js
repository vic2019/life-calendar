import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { MyTag } from './MyComponents';
import uuidv4 from 'uuid/v4';


const coral = '#f1948a';
const salmon = '#FFC0CB';
const purple = '#c39bd3'; 
const cyan = '#7fb3d5';
const sky = '#aed6f1';
const lime = '#7dcea0';
const gold = '#f1c40f';
const orange = '#f5b041';


class EpochForm extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }


  handleSelectColor = (value) => {
    this.props.form.setFieldsValue({color: value});
  }


  render() {
    const { visible, onCancel, onCreate, onDelete, form, 
      selectedEpoch, modalTitle } = this.props;
    const { getFieldDecorator } = form;
    const { title, note, color } = selectedEpoch.current?
      selectedEpoch.current: {title: '', note: '', color: ''};


    return (
      <Modal
        visible={visible}
        title={modalTitle}
        okText='Save'
        onCancel={onCancel}
        onOk={onCreate}
      >
      <Form className='epoch-info' layout='vertical' hideRequiredMark={true}>
        <Form.Item>
        {getFieldDecorator('title', {
                rules: [{
                  required: true, min: 1, whitespace: true, 
                  message: 'A title is required'
                }], initialValue: title
              })(
          <Input
            placeholder='Title'
            style={{ width: '80%' }} 
          />
        )}
        </Form.Item>
        <Form.Item name='note'>
        {getFieldDecorator( 'note', 
        {validateTrigger: 'onSubmit', initialValue: note})(
          <Input.TextArea
            autosize={{ minRows: 5 }}
            placeholder='Note' 
          />
        )}
        </Form.Item>
        <Form.Item>
          <MyTag 
            color={coral}
            value={coral}
            onChecked={this.handleSelectColor}
          >
            coral
          </MyTag>
          <MyTag 
            color={salmon}
            value={salmon}
            onChecked={this.handleSelectColor}
          >
            salmon
          </MyTag>
          <MyTag 
            color={purple} 
            value={purple} 
            onChecked={this.handleSelectColor}
          >
            purple
          </MyTag>
          <MyTag 
            color={cyan} 
            value={cyan} 
            onChecked={this.handleSelectColor}
          >
            cyan
          </MyTag>
          <MyTag 
            color={sky} 
            value={sky} 
            onChecked={this.handleSelectColor}
          >
            sky
          </MyTag>
          <MyTag 
            color={lime} 
            value={lime} 
            onChecked={this.handleSelectColor}
          >
            lime
          </MyTag>
          <MyTag 
            color={gold} 
            value={gold} 
            onChecked={this.handleSelectColor}
          >
            gold
          </MyTag>
          <MyTag 
            color={orange} 
            value={orange} 
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
        "title": values.title.trim(),
        "note": (values.note || '').trimRight() || ' ',
        "color": values.color,
        "start": selectedPeriod.current.start,
        "end": selectedPeriod.current.end,
        "uuid": selectedEpoch.current?
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
    const modalTitle = 'Create a life stage';
    if (selectedPeriod.current) {
      return modalTitle + ' for ' + 
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