import {
  Button, Form, Input, notification,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserInput } from 'src/@types/user';
import { toLibraryList } from 'src/Components/Router/routes';
import useNavigation from 'src/hooks/navigation';

import { useBackend } from 'src/integrations/backend';
import Props from './FormUpdateLibrary.type';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};

const FormUpdateLibrary: React.FC<Props> = ({ library }) => {
  const [form] = Form.useForm();
  const [isFormLoading, setIsFormLoading] = useState(false);
  const backend = useBackend();
  const history = useHistory();
  const { setTitles } = useNavigation();

  const onFinish = async (values: UserInput) => {
    setIsFormLoading(true);

    const [result, error] = await backend.libraries.updateOneK({ ...values });

    if (error) {
      notification.error({
        message: '¡Ocurrió un error al guardar!',
        description: 'Intentalo después.',
      });
    }
    if (result) {
      notification.success({
        message: '¡Libreria modificada!',
        description: 'Puedes modificar más librerías o verificar el detalle de la librería.',
      });
      history.push(toLibraryList());
      form.resetFields();
    }

    setIsFormLoading(false);
  };

  const onFinishFailed = () => {
    notification.error({
      message: '¡Ocurrió un error al guardar!',
      description: 'Intentalo después.',
    });
  };

  useEffect(() => {
    setTitles({
      title: 'Modificar Librerias', subtitle: '',
    });
    // eslint-disable-next-line
      }, []);

  const INITIAL_STATE = {
    email: library.email,
    name: library.name,
    phoneNumber: library.phoneNumber,
    state: library.state,
    city: library.city,
    address: library.address,
    inCharge: library.inCharge,
  };
  return (
    <Form
      {...layout}
      form={form}
      name="updateLibrary"
      initialValues={INITIAL_STATE}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      size="large"
      scrollToFirstError
    >
      <Form.Item
        label="Nombre librería"
        name="name"
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        label="email"
        name="email"
        rules={[
          {
            type: 'email',
            message: 'Ingresa un email válido',
          },
          {
            required: true,
            message: 'Debes ingresar un email',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Numero celular"
        name="phoneNumber"
        rules={[
          {
            required: true,
            message: 'Debes ingresar un numero celular',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Estado"
        name="state"
        rules={[
          {
            required: true,
            message: 'Debes ingresar un estado',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Ciudad"
        name="city"
        rules={[
          {
            required: true,
            message: 'Debes ingresar una ciudad',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Dirección"
        name="address"
        rules={[
          {
            required: true,
            message: 'Debes ingresar una dirección',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="En Cargo"
        name="inCharge"
        rules={[
          {
            required: true,
            message: 'Debes ingresar un encargado',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button
          loading={isFormLoading}
          type="primary"
          htmlType="submit"
        >
          Modificar Librería
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormUpdateLibrary;
