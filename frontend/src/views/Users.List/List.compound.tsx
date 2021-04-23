import { Button } from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { NEW_USER } from 'src/Components/Router/routes';
import useNavigation from 'src/hooks/navigation';

const ListUsers: React.FC = () => {
  const history = useHistory();
  const { setTitles } = useNavigation();

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
  }, [setTitles, history]);

  return (
    <></>
  );
};

export default ListUsers;
