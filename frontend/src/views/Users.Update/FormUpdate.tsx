import {
    Button, Col, Form, Input, notification, Row, Select, Switch,
  } from 'antd';
  import React, {  useEffect, useState } from 'react';
  import {  useHistory } from 'react-router-dom';
  import { Library, wrapError } from 'src/@types';
import User, { StoredRole, StoredUser, UserInput } from 'src/@types/user';
import { toUserList } from 'src/Components/Router/routes';
  import useNavigation from 'src/hooks/navigation';

  import { useBackend } from 'src/integrations/backend';
  import Props from './FormUpdate.type';
  

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  };
  
  const tailLayout = {
    wrapperCol: { offset: 6, span: 18 },
  };

    
  
  const FormUpdate:   React.FC<Props> = ({ user }) => {
    const [form] = Form.useForm();
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [isMetadataLoading, setIsMedatadaLoading] = useState(true);
    const backend = useBackend();
    const history = useHistory();
    const [metadata, setMetadata] = useState<{
        roles: StoredRole[], libraries: Library[],users: StoredUser[],
      }>({ roles: [], libraries: [] ,users: [] });
    const { setTitles } = useNavigation();

    const fetchMetadata = async () => {
        setIsMedatadaLoading(true);
        const [result, error] = await wrapError(
          Promise.all([
            backend.libraries.getAll<{ libraries: Library[] }>(),
            backend.users.get<{ roles: StoredRole[] }>('/roles'),
            backend.usersId.getAll<{users: User[]}>(`id=${user.id}`),
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

    const onFinish = async (values: UserInput) => {
        setIsFormLoading(true);
    
        const [result, error] = await backend.users.updateOneK({ ...values });
    
        console.log({ ...values});
    
        if (error) {
          notification.error({
            message: '¡Ocurrió un error al guardar!',
            description: 'Intentalo después.',
          });
        } else {
          notification.success({
            message: '¡Usuario modificado!',
            description: 'Puedes modificar más usuarios o verificar el detalle del usuario.',
          });
          history.push(toUserList());
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
      fetchMetadata();
      setTitles({
        title: 'Modificar Usuario', subtitle: '',
      });
      // eslint-disable-next-line
    }, []);

    const INITIAL_STATE = {
        email: user.email,
        displayName: user.displayName,
        disabled: user.disabled,
        libraryId: user.libraryId,
        roleId: user.roleId,
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
          <Input disabled />
        </Form.Item>
  
        <Form.Item
        
          label="Nombre"
          name="displayName"
          
        >
          <Input  />
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
        >
          <Switch defaultChecked= {user.disabled} />
        </Form.Item>
  
        <Form.Item
          label="Rol"
          name="roleId"
          rules={[{
            required: true,
            message: 'Debes seleccionar un rol',
          }]}
        >
          <Select  showSearch disabled={isMetadataLoading} loading={isMetadataLoading}>
            {metadata.roles.map((role) => (
              
              <Select.Option key={role.id} value={role.id} >{role.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
  
        <Form.Item {...tailLayout}>
          <Button
            loading={isFormLoading || isMetadataLoading}
            type="primary"
            htmlType="submit"
          >
            Modificar Usuario
          </Button>
        </Form.Item>
      </Form>
    );
  };
  
  export default FormUpdate;
  