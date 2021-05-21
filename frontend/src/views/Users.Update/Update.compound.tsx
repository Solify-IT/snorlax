import {
    Button, Form, Input, notification, Select,
  } from 'antd';
  import React, { useCallback, useEffect, useState } from 'react';
  import { useHistory } from 'react-router-dom';
  import { Book, Library, wrapError } from 'src/@types';
  import User, { StoredRole, StoredUser, UserInput } from 'src/@types/user';
  import { toUserDetail } from 'src/Components/Router/routes';
  import useNavigation from 'src/hooks/navigation';
  import { useBackend } from 'src/integrations/backend';
  import {
    useParams
  } from "react-router-dom";
  import { RouteComponentProps } from "react-router-dom";
  import FormUpdate from './FormUpdate';
import form from 'antd/lib/form';
  
  const Update: React.FC = (props) => {
  

  /*const fetchUsers = useCallback(async () => {
    setIsLoading(true);

    const [result, error] = await backend.usersId.getOneById<{ user: User }>(id);

    if (error || !result) {
      notification.error({
        message: 'Error al cargar informacion del libro',
        description: 'Intentalo más tarde.',
      });
      setIsLoading(false);
      return;
    }

    setUser(result.data.user);
    setIsLoading(false);
  }, [backend.users]);
    
    
    /*const [metadata, setMetadata] = useState<{
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
    
        fetchMetadata({
          libraries: result[0][0]!.data.libraries,
          roles: result[1][0]!.data.roles,
          users: result[2][0]!.data.users,
        });
        console.log(result[2][0].data);
        setIsMedatadaLoading(false);
      };

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

      */

  const [user, setUser] = useState<User | undefined>(undefined);
  const [userp, setUserp] = useState<StoredUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const backend = useBackend();
  const { setTitles } = useNavigation();
  const { id } = useParams<{ id: string }>();
  const [metadata, setMetadata] = useState<{
    users: StoredUser[],
  }>({ users: [] });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);

    const [result, error] = await backend.usersId.getOneById<{ users: User[]}>(`?id=${id}`);
   
    if (error || !result) {
      notification.error({
        message: 'Error al cargar informacion del libro',
        description: 'Intentalo más tarde.',
      });
      setIsLoading(false);
      return;
    }
    console.log(result.data.users[0]);
    setUser(result.data.users[0]);
    setIsLoading(false);
  }, [backend.usersId]);

  const fetchMetadata = useCallback(async () => {
    setIsLoading(true);
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
      setIsLoading(false);
      return;
    }

    setUserp(result[2][0].data.users[0]);
   // console.log(result[2][0].data.users[0].displayName);
    setIsLoading(false);
  },[backend.usersId]);

  useEffect(() => {
    setTitles({ title: 'Modificar usuario' });
    fetchMetadata();
    fetchUsers();
  }, [fetchMetadata,setTitles]);
  if (!user) {
    return null;
  }

  
    return (
      <FormUpdate user={user} isLoading={isLoading} >h</FormUpdate>
    )
  };
  
  export default Update;
  