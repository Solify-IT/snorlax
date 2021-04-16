import { notification } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Book } from 'src/@types';
import { useBackend } from 'src/integrations/backend';

const LocalBooksList: React.FC = () => {
  const backend = useBackend();
  const [books, setBooks] = useState<Book[]>([]);
  const LIBRARY_ID = 'e11e5635-094c-4224-836f-b0caa13986f3';

  const fetchBooks = useCallback(async () => {
    const [result, error] = await backend.books.getAll<Book>(`libraryId=${LIBRARY_ID}`);

    if (error || !result) {
      notification.error({ message: 'Ocurrió un error al obtener la lista de libros' });
      return;
    }

    setBooks(result.data);
  }, [backend.books]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <></>
  );
};

export default LocalBooksList;
