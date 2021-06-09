import { notification } from 'antd';
import { Moment } from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { Movement } from 'src/@types';
import useAuth from 'src/hooks/auth';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import ListReport from './Report';

const ListReports: React.FC = () => {
  const { user } = useAuth();
  const { setTitles } = useNavigation();
  const backend = useBackend();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovements = useCallback(async (range: [Moment, Moment], type: string) => {
    setIsLoading(true);
    const [result, error] = await backend
      .reports
      .getAllObject<{ movements: Movement[] }>(
      `fechaInitial=${range[0].unix() * 1000}&fechaEnd=${range[1].unix() * 1000}&type=${type}&desglosado=no&libraryId=${user?.libraryId}`,
    );

    if (error || !result) {
      notification.error({ message: 'Ocurrió un error al cargar los movimientos!', description: 'Intentalo más tarde' });
      return;
    }
    setMovements(result.data.movements);
    setIsLoading(false);
  }, [backend.movements]);

  useEffect(() => {
    setTitles({
      title: 'Reportes de movimientos',
    });
  }, [setTitles]);

  return (
    <ListReport movements={movements} loading={isLoading} onFetchMovements={fetchMovements} />
  );
};

export default ListReports;
