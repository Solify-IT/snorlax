import {
    Button, Form, Input, notification, Select,
  } from 'antd';
  import React, { useCallback, useEffect, useState } from 'react';
  import { useHistory } from 'react-router-dom';
  import { Library, wrapError } from 'src/@types';
  import User, { StoredRole, StoredUser, UserInput } from 'src/@types/user';
  import { toUserDetail } from 'src/Components/Router/routes';
  import useNavigation from 'src/hooks/navigation';
  import { useBackend } from 'src/integrations/backend';
  import {
    useParams
  } from "react-router-dom";
  import { RouteComponentProps } from "react-router-dom";

  
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

    interface RouteParams {
        id: string
    }

    interface Update extends RouteComponentProps<RouteParams> {
    }
  
  
  const Update: React.FC<Update> = (props) => {
    const { setTitles } = useNavigation();
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [isMetadataLoading, setIsMedatadaLoading] = useState(true);
    const [metadata, setMetadata] = useState<{
      roles: StoredRole[], libraries: Library[],
    }>({ roles: [], libraries: [] });
    const backend = useBackend();
    const history = useHistory();
    const [userInformation, setUser] = useState<StoredUser[]>([]);
    const [form] = Form.useForm();
    const [users, setUsers] = useState<User[]>([]);
   
    console.log(props.match.params.id);

    const fetchuser = useCallback(async () => {
        const [result, error] = await backend.users.getOne(`?${props.match.params.id}`);
    
        if (error || !result) {
          notification.error({ message: 'Ocurrió un error al obtener al usuario' });
          return;
        }
        console.log(result.data);
        console.log('hola');
      }, [backend.users]);



     
    
    const fetchMetadata = async () => {
      setIsMedatadaLoading(true);
      const [result, error] = await wrapError(
        Promise.all([
          backend.libraries.getAll<{ libraries: Library[] }>(),
          backend.users.get<{ roles: StoredRole[] }>('/roles'),
        ]),
      );
  
      if (error || !result || !result[0][0] || !result[1][0]) {
        notification.error({
          message: 'Ocurrió un problema al cargar.', description: 'Intentalo más tarde.',
        });
        setIsMedatadaLoading(false);
        return;
      }
  
      setMetadata({
        libraries: result[0][0]!.data.libraries,
        roles: result[1][0]!.data.roles,
      });
      setIsMedatadaLoading(false);
    };
  
    useEffect(() => {
      setTitles({
        title: 'Modificar usuario', subtitle: 'Ingresa todos los campos a modificar',
      });
      fetchMetadata();
      fetchuser();
      // eslint-disable-next-line
    }, [INITIAL_STATE]);
  
    const onFinish = async (values: UserInput) => {
      setIsFormLoading(true);
  
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
  
      setIsFormLoading(false);
    };
  
    //this.props.match.params.id;
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
            () => ({
              validator(_, value) {
                const paswdRegex = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
                if (paswdRegex.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(
                  'La contraseña es debil. Debe tener una mayuscula, una minuscula, un número, un símbolo y mínimo 8 caracteres de longitud',
                ));
              },
            }),
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
          <Select showSearch disabled={isMetadataLoading} loading={isMetadataLoading}>
            {metadata.libraries.map((lib) => (
              <Select.Option key={lib.id} value={lib.id}>{lib.name}</Select.Option>
            ))}
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
          <Select showSearch disabled={isMetadataLoading} loading={isMetadataLoading}>
            {metadata.roles.map((role) => (
              <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
  
        <Form.Item {...tailLayout}>
          <Button
            loading={isFormLoading || isMetadataLoading}
            type="primary"
            htmlType="submit"
          >
            Registrar Usuario
          </Button>
        </Form.Item>
      </Form>
    );
  };
  
  export default Update;
  