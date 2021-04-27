import { Button } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { StoredUser } from 'src/@types/user';
import { NEW_USER } from 'src/Components/Router/routes';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';

const ListUsers: React.FC = () => {
  const history = useHistory();
  const { setTitles } = useNavigation();
  const backend = useBackend();

  const fetchUsers = useCallback(async () => {
    const [result, error] = await backend.users.getAll<{ users: StoredUser[] }>();
    console.log(result!.data.users);
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
    <></>
  );
};

export default ListUsers;
