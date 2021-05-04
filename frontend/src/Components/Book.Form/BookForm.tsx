import {
  Button, Form, Input, InputNumber, Switch,
} from 'antd';
import React from 'react';
import Props from './BookForm.type';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};

const BookForm: React.FC<Props> = ({
  initialState,
  onFinish,
  onFinishFailed,
  form,
  onISBNChange,
  isLoading,
}) => (
  <Form
    {...layout}
    form={form}
    name="registerBook"
    initialValues={initialState}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    size="large"
  >
    <Form.Item
      label="ISBN"
      name="isbn"
      rules={[{
        required: true,
        message: 'Debes ingresar un ISBN válido',
        len: 13,
      }]}
    >
      <Input onChange={onISBNChange} />
    </Form.Item>

    <Form.Item
      label="Precio"
      name="price"
      rules={[{
        required: true,
        message: 'Debes ingresar un precio válido',
      }]}
    >
      <InputNumber />
    </Form.Item>

    <Form.Item
      label="Cantidad"
      name="amount"
      rules={[{
        required: true,
        message: 'Debes ingresar una cantidad válida',
      }]}
    >
      <InputNumber />
    </Form.Item>

    <Form.Item label="¿Es consigna?" name="isLoan">
      <Switch />
    </Form.Item>

    <Form.Item {...tailLayout}>
      <Button
        loading={isLoading}
        type="primary"
        htmlType="submit"
      >
        Guardar
      </Button>
    </Form.Item>
  </Form>
);

export default BookForm;
