import {
  Button, Form, Input, InputNumber, Switch,
} from 'antd';
import React, { useState } from 'react';
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
}) => {
  const [isManualInsert] = useState(false);

  return (
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

      <Form.Item
        label="Título"
        name="title"
        rules={[{
          required: isManualInsert,
          message: 'Debes ingresar un título',
        }]}
      >
        <Input disabled={!isManualInsert} readOnly={!isManualInsert} onChange={onISBNChange} />
      </Form.Item>

      <Form.Item
        label="Autor"
        name="author"
        rules={[{
          required: isManualInsert,
          message: 'Debes ingresar un autor',
        }]}
      >
        <Input disabled={!isManualInsert} readOnly={!isManualInsert} />
      </Form.Item>

      <Form.Item
        label="Sinopsis"
        name="synopsis"
      >
        <Input.TextArea disabled={!isManualInsert} readOnly={!isManualInsert} />
      </Form.Item>

      <Form.Item
        label="Páginas"
        name="pages"
      >
        <InputNumber disabled={!isManualInsert} readOnly={!isManualInsert} />
      </Form.Item>

      <Form.Item
        label="Costo unitario"
        name="unitaryCost"
      >
        <InputNumber disabled={!isManualInsert} readOnly={!isManualInsert} />
      </Form.Item>

      <Form.Item
        label="Area"
        name="area"
      >
        <Input disabled={!isManualInsert} readOnly={!isManualInsert} />
      </Form.Item>

      <Form.Item
        label="Encuadernación"
        name="coverType"
      >
        <Input disabled={!isManualInsert} readOnly={!isManualInsert} />
      </Form.Item>

      <Form.Item
        label="Colección"
        name="collection"
      >
        <Input disabled={!isManualInsert} readOnly={!isManualInsert} />
      </Form.Item>

      <Form.Item
        label="Distribuidor"
        name="distribuitor"
      >
        <Input disabled={!isManualInsert} readOnly={!isManualInsert} />
      </Form.Item>

      <Form.Item
        label="Editorial"
        name="editorial"
      >
        <Input disabled={!isManualInsert} readOnly={!isManualInsert} />
      </Form.Item>

      <Form.Item
        label="Proveedor"
        name="provider"
      >
        <Input disabled={!isManualInsert} readOnly={!isManualInsert} />
      </Form.Item>

      <Form.Item
        label="Subcategoría"
        name="subCategory"
      >
        <Input disabled={!isManualInsert} readOnly={!isManualInsert} />
      </Form.Item>

      <Form.Item
        label="Tema"
        name="theme"
      >
        <Input disabled={!isManualInsert} readOnly={!isManualInsert} />
      </Form.Item>

      <Form.Item
        label="Subtema"
        name="subTheme"
      >
        <Input disabled={!isManualInsert} readOnly={!isManualInsert} />
      </Form.Item>

      <Form.Item
        label="Tipo"
        name="type"
      >
        <Input disabled={!isManualInsert} readOnly={!isManualInsert} />
      </Form.Item>

      <Form.Item
        label="URL de portada"
        name="coverImageUrl"
      >
        <Input disabled={!isManualInsert} readOnly={!isManualInsert} />
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
};

export default BookForm;
