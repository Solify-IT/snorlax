import {
  Button, Form, Input, notification,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LibraryInput } from 'src/@types/library';
import { UserInput } from 'src/@types/user';
import { toLibraryDetail } from 'src/Components/Router/routes';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';

const INITIAL_STATE: LibraryInput = {
  email: '',
  name: '',
  phoneNumber: '',
  state: '',
  city: '',
  address: '',
  inCharge: '',
};

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};

const RegisterLibrary: React.FC = () => {
  const { setTitles } = useNavigation();
  const [isFormLoading, setIsFormLoading] = useState(false);
  const backend = useBackend();
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    setTitles({
      title: 'Crear nueva librería', subtitle: 'Ingresa todos los campos requeridos',
    });
    // eslint-disable-next-line
    }, [INITIAL_STATE]);

  const onFinish = async (values: UserInput) => {
    setIsFormLoading(true);
    const [result, error] = await backend.libraries.createOne({ ...values });

    if (error) {
      notification.error({
        message: '¡Ocurrió un error al guardar!',
        description: 'Intentalo después.',
      });
    }
    if (result) {
      notification.success({
        message: '¡Librería creada!',
        description: 'Puedes añadir más librerias o ir al detalle del libro agregado.',
        btn: (
          <Button
            type="primary"
            onClick={() => history.push(toLibraryDetail(result!.data.id))}
          >
            Ir al detalle
          </Button>
        ),
      });
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

  return (
    <Form
      {...layout}
      form={form}
      name="registerLibrary"
      initialValues={INITIAL_STATE}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      size="large"
      scrollToFirstError
    >
      <Form.Item
        label="E-Mail"
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
        label="Nombre"
        name="name"
        rules={[{
          required: true,
          message: 'Ingresar el nombre',
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Celular"
        name="phoneNumber"
        rules={[{
          required: true,
          message: 'Ingresar el numero celular',
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Estado"
        name="state"
        rules={[{
          required: true,
          message: 'Ingresar el estado',
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Ciudad"
        name="city"
        rules={[{
          required: true,
          message: 'Ingresar la ciudad',
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Direccion"
        name="address"
        rules={[{
          required: true,
          message: 'Ingresar la dirección',
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Persona a cargo"
        name="inCharge"
        rules={[{
          required: true,
          message: 'Ingresar la persona encargada',
        }]}
      >
        <Input />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button
          loading={isFormLoading}
          type="primary"
          htmlType="submit"
        >
          Registrar Libreria
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterLibrary;
