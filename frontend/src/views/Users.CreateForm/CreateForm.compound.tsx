import {
  Button, Form, Input, notification, Select,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserInput } from 'src/@types/user';
import { toUserDetail } from 'src/Components/Router/routes';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';

const INITIAL_STATE: UserInput = {
  email: '',
  password: '',
  displayName: '',
  disabled: false,
  libraryId: '',
  roleId: '',
};

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};

const RegisterForm: React.FC = () => {
  const { setTitles } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const backend = useBackend();
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    setTitles({
      title: 'Crear nuevo usuario', subtitle: 'Ingresa todos los campos requeridos',
    });
    // eslint-disable-next-line
  }, [INITIAL_STATE]);

  const onFinish = async (values: UserInput) => {
    setIsLoading(true);
    const [result, error] = await backend.users.createOne({ ...values, disabled: false });

    if (error) {
      notification.error({
        message: '¡Ocurrió un error al guardar!',
        description: 'Intentalo después.',
      });
    } else {
      notification.success({
        message: '¡Usuario creado!',
        description: 'Puedes añadir más usuarios o ir al detalle del usuario agregado.',
        btn: (
          <Button
            type="primary"
            onClick={() => history.push(toUserDetail(result!.data.id))}
          >
            Ir al detalle
          </Button>
        ),
      });
      form.resetFields();
    }

    setIsLoading(false);
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
      name="registerUser"
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
        name="displayName"
        rules={[{
          required: true,
          message: 'Ingresar el nombre',
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Contraseña"
        name="password"
        rules={[
          {
            required: true,
            message: 'Debes ingresar una contraseña',
          },
          {
            min: 8,
            message: 'La contraseña debe ser de mínimo 8 caracteres',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Librería"
        name="libraryId"
        rules={[{
          required: true,
          message: 'Debes seleccionar una librería',
        }]}
      >
        <Select showSearch>
          <Select.Option value="e11e5635-094c-4224-836f-b0caa13986f3">Testito</Select.Option>
          <Select.Option value="e11e5635-094c-4224-836f-b0caa13986f4">Choose</Select.Option>
          <Select.Option value="e11e5635-094c-4224-836f-b0caa13986f5">Wow</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Rol"
        name="roleId"
        rules={[{
          required: true,
          message: 'Debes seleccionar un rol',
        }]}
      >
        <Select showSearch>
          <Select.Option value="e450d7e3-05a7-4750-8791-de92772d4275">Admin</Select.Option>
          <Select.Option value="e450d7e3-05a7-4750-8791-de92772d4276">Librero</Select.Option>
          <Select.Option value="e450d7e3-05a7-4750-8791-de92772d4277">Otro</Select.Option>
        </Select>
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

export default RegisterForm;
