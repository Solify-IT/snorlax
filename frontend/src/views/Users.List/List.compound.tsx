import { Button, notification } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { StoredUser } from 'src/@types/user';
import { NEW_USER } from 'src/Components/Router/routes';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import ListView from './ListView';

const ListUsers: React.FC = () => {
  const history = useHistory();
  const { setTitles } = useNavigation();
  const backend = useBackend();
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const [result, error] = await backend.users.getAll<{ users: StoredUser[] }>();

    if (error || !result) {
      notification.error({ message: 'Ocurrió un error al cargar los usuarios!', description: 'Intentalo más tarde' });
      return;
    }

    setUsers(result.data.users);
    console.log(result.data.users[0].email);
    setIsLoading(false);
  }, [backend.users]);

  useEffect(() => {
    setTitles({
      title: 'Lista de usuarios',
      extra: [
        <Button
          type="primary"
          onClick={() => history.push(NEW_USER)}
        >
          Nuevo usuario
        </Button>,
      ],
    });
    fetchUsers();
  }, [setTitles, history, fetchUsers]);

  return (
    <ListView users={users} loading={isLoading} />
  );
};

export default ListUsers;
