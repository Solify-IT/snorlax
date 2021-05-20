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
    const INITIAL_STATE: UserInput = {
      email: '',
      password: '',
      displayName: '',
      disabled: false,
      libraryId: '',
      roleId: '',
    };

    
  
  
  const Update: React.FC = (props) => {
    const { setTitles } = useNavigation();
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [isMetadataLoading, setIsMedatadaLoading] = useState(true);
    const [metadata, setMetadata] = useState<{
      roles: StoredRole[], libraries: Library[],users: StoredUser[],
    }>({ roles: [], libraries: [] ,users: [] });
    const backend = useBackend();
    const history = useHistory();
    const [form] = Form.useForm();
    const [usersInfo, setUsers] = useState<User[]>([]);
    const { id } = useParams<{ id: string }>();
    let displayNameApi = '';
    let emailApi = '';
    let libreriaApi = '';
    let rolApi= '';

      const fetchMetadata = async () => {
        setIsMedatadaLoading(true);
        const [result, error] = await wrapError(
          Promise.all([
            backend.libraries.getAll<{ libraries: Library[] }>(),
            backend.users.get<{ roles: StoredRole[] }>('/roles'),
            backend.usersId.getAll<{users: User[]}>(`id=${id}`),
          ]),
        );
    
        if (error || !result || !result[0][0] || !result[1][0]|| !result[2][0]) {
          notification.error({
            message: 'Ocurrió un problema al cargar.', description: 'Intentalo más tarde.',
          });
          setIsMedatadaLoading(false);
          return;
        }
    
        setMetadata({
          libraries: result[0][0]!.data.libraries,
          roles: result[1][0]!.data.roles,
          users: result[2][0]!.data.users,
        });
        console.log(result[2][0].data);
        setIsMedatadaLoading(false);
      };
      
      
  
    useEffect(() => {
      setTitles({
        title: 'Modificar usuario', subtitle: 'Ingresa todos los campos a modificar',
      });
      fetchMetadata();
    }, [INITIAL_STATE]);

  
    const onFinish = async (values: UserInput) => {
      setIsFormLoading(true);
  
      const [result, error] = await backend.users.updateOneK({ ...values, disabled: false });

      console.log({ ...values, disabled: false });
  
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
          <Input disabled={isMetadataLoading} />
        </Form.Item>
  
        <Form.Item
        
          label="nombre"
          name="displayName"
          
        >
          <Input  disabled={isMetadataLoading} />
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
          <Input.Password  disabled={isMetadataLoading}/>
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
          label="Usuario Activo"
          name="disabled"
          rules={[{
            required: true,
            message: 'Debes seleccionar un estado',
          }]}
        >
          <Select showSearch disabled={isMetadataLoading} loading={isMetadataLoading}>
              <Select.Option value="si">Si</Select.Option>
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
  