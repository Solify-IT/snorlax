import { notification } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Library } from 'src/@types';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import LibrariesListViewComp from './ListView';

const LibrariesListView: React.FC = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const backend = useBackend();
  const { setTitles } = useNavigation();

  const fetchLibraries = useCallback(async () => {
    setIsLoading(true);

    const [result, error] = await backend.libraries.getAll<{ libraries: Library[] }>();

    if (error || !result) {
      notification.error({
        message: 'Error al cargar las librerías',
        description: 'Intentalo más tarde.',
      });
      setIsLoading(false);
      return;
    }

    setLibraries(result.data.libraries);

    setIsLoading(false);
  }, [backend.libraries]);

  useEffect(() => {
    setTitles({ title: 'Librerías' });
    fetchLibraries();
  }, [fetchLibraries, setTitles]);

  return (
    <LibrariesListViewComp libraries={libraries} isLoading={isLoading} />
  );
};

export default LibrariesListView;
