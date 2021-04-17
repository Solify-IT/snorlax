import { notification } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Book } from 'src/@types';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import LocalBooksListComp from './LocalBooksList';

const LocalBooksList: React.FC = () => {
  const backend = useBackend();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setTitles } = useNavigation();
  const LIBRARY_ID = 'e11e5635-094c-4224-836f-b0caa13986f3';

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    const [result, error] = await backend.books.getAll<{ books: Book[] }>(`libraryId=${LIBRARY_ID}`);

    if (error || !result) {
      notification.error({ message: 'Ocurrió un error al obtener la lista de libros' });
      return;
    }

    setBooks(result.data.books);
    setIsLoading(false);
  }, [backend.books]);

  useEffect(() => {
    fetchBooks();
    setTitles({ title: 'Libros en el inventario' });
  }, [fetchBooks, setTitles]);

  return (
    <LocalBooksListComp isLoading={isLoading} books={books} />
  );
};

export default LocalBooksList;
