import {
    notification,
  } from 'antd';
  import React, { useCallback, useEffect, useState } from 'react';
  import User from 'src/@types/user';
  import useNavigation from 'src/hooks/navigation';
  import { useBackend } from 'src/integrations/backend';
  import {
    useParams,
  } from 'react-router-dom';
  import FormUpdate from './FormUpdate';
  
  const Update: React.FC = () => {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const backend = useBackend();
    const { setTitles } = useNavigation();
    const { id } = useParams<{ id: string }>();
  
    const fetchUsers = useCallback(async () => {
      setIsLoading(true);
      const [result, error] = await backend.usersId.getOneById<{ users: User[] }>(`?id=${id}`);
      if (error || !result) {
        notification.error({
          message: 'Error al cargar informacion del libro',
          description: 'Intentalo más tarde.',
        });
        setIsLoading(false);
        return;
      }
      setUser(result.data.users[0]);
      setIsLoading(false);
    }, [backend.usersId]);
  
    useEffect(() => {
      setTitles({ title: 'Modificar usuario' });
      fetchUsers();
    }, [setTitles]);
    if (!user) {
      return null;
    }
  
    return (
      <FormUpdate user={user} isLoading={isLoading}>h</FormUpdate>
    );
  };
  
  export default Update;
  