import { notification } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Movement } from 'src/@types';
import useAuth from 'src/hooks/auth';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import ListMovement from './Movement';

const ListMovements: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const { setTitles } = useNavigation();
  const backend = useBackend();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovements = useCallback(async () => {
    setIsLoading(true);
    const [result, error] = await backend.movements.getAll<{ movements: Movement[] }>(`libraryId=${user?.libraryId}`);

    if (error || !result) {
      notification.error({ message: 'Ocurrió un error al cargar los movimientos!', description: 'Intentalo más tarde' });
      return;
    }
    setMovements(result.data.movements);
    setIsLoading(false);
  }, [backend.movements]);

  useEffect(() => {
    setTitles({
      title: 'Lista de movimientos',
    });
    fetchMovements();
  }, [setTitles, history, fetchMovements]);

  return (
    <ListMovement movements={movements} loading={isLoading} />
  );
};

export default ListMovements;
