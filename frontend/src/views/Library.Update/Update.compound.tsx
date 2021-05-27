import {
  notification,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import {
  useParams,
} from 'react-router-dom';
import { Library } from 'src/@types/library';
import FormUpdateLibrary from './FormUpdateLibrary';

const Update: React.FC = () => {
  const [library, setLibrary] = useState<Library | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const backend = useBackend();
  const { setTitles } = useNavigation();
  const { id } = useParams<{ id: string }>();

  const fetchLibraries = useCallback(async () => {
    setIsLoading(true);
    const [result, error] = await backend.librariesId.getOneById<{ libraries: Library[] }>(`?id=${id}`);

    if (error || !result) {
      notification.error({
        message: 'Error al cargar informacion del libro',
        description: 'Intentalo más tarde.',
      });
      setIsLoading(false);
      return;
    }
    setLibrary(result.data.libraries[0]);
    setIsLoading(false);
  }, [backend.librariesId]);

  useEffect(() => {
    setTitles({ title: 'Modificar libreria' });
    fetchLibraries();
  }, [setTitles]);
  if (!library) {
    return null;
  }

  return (
    <FormUpdateLibrary library={library} isLoading={isLoading}>h</FormUpdateLibrary>
  );
};

export default Update;
