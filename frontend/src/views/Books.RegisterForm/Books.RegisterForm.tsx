import {
  Button, Form, Input, InputNumber, notification, Spin, Switch,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import { StateType } from './Books.RegisterForm.type';

const INITIAL_STATE = {
  isbn: '',
  price: 0,
  amount: 1,
  isLoan: false,
};

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 12 },
};

const RegisterForm: React.FC = () => {
  const { setTitles } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const backend = useBackend();
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    setTitles({
      title: 'Añadir libros', subtitle: 'Ingresa todos los campos requeridos',
    });
    // eslint-disable-next-line
  }, [INITIAL_STATE]);

  const onFinish = async (values: StateType) => {
    setIsLoading(true);
    const [result, error] = await backend.books.createOne({
      ...values, libraryId: 'e11e5635-094c-4224-836f-b0caa13986f3',
    });

    if (error) {
      notification.error({
        message: '¡Ocurrió un error al guardar!',
        description: 'Intentalo después.',
      });
    } else {
      notification.success({
        message: '¡Libro guardado!',
        description: 'Puedes añadir más libros o ir al detalle del libro agregado.',
        btn: (
          <Button
            type="primary"
            onClick={() => history.push(`/books/${result!.data.id}`)}
          >
            Ir al detalle
          </Button>
        ),
      });
      form.resetFields();
    }

    setIsLoading(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      {...layout}
      form={form}
      name="registerBook"
      initialValues={INITIAL_STATE}
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
        <Input />
      </Form.Item>

      <Form.Item
        label="Precio"
        name="price"
        rules={[{
          required: true,
          message: 'Debes ingresar un precio válido',
          // min: 0,
          // max: 9999,
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
          // min: 0,
          // max: 9999,
        }]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item label="¿Es consigna?" name="isLoan">
        <Switch />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button disabled={isLoading} type="primary" htmlType="submit">
          {isLoading ? <Spin size="small" /> : 'Guardar'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
