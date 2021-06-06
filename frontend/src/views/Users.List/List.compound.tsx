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
    setIsLoading(false);
  }, [backend.users]);

  const updateAfterDeleteUser = useCallback((id: string) => {
    const indexOfDeleted = users.findIndex((user) => user.id === id);
    if (indexOfDeleted !== -1) {
      setUsers([
        ...users.slice(0, indexOfDeleted),
        ...users.slice(indexOfDeleted + 1),
      ]);
    }
  }, [setUsers, users]);

  const onFinishDrop = async (id: string) => {
    setIsLoading(true);

    const [res, err] = await backend.users.delete<any>(id);

    if (err || !res) {
      notification.error({ message: 'Ocurrió un error al eliminar usuaro!', description: 'Intentalo más tarde' });
      return;
    }

    updateAfterDeleteUser(id);
    notification.success({ message: 'Eliminacion completada exitosamente' });
    setIsLoading(false);
  };
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
    <ListView
      users={users}
      loading={isLoading}
      onFinishDrop={onFinishDrop}
    />
  );
};

export default ListUsers;
