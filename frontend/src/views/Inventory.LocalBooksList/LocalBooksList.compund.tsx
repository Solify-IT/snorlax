import { notification } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Book } from 'src/@types';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import LocalBooksListComp from './LocalBooksList';

const LocalBooksList: React.FC = () => {
  const backend = useBackend();
  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });
  const [isLoading, setIsLoading] = useState(false);
  const { setTitles } = useNavigation();
  const LIBRARY_ID = 'e11e5635-094c-4224-836f-b0caa13986f3';

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    const [result, error] = await backend.books.getAll<{
      total: number,
      books: Book[],
    }>(`libraryId=${LIBRARY_ID}&page=${pagination.page}&perPage=${pagination.perPage}`);

    if (error || !result) {
      notification.error({ message: 'Ocurrió un error al obtener la lista de libros' });
      return;
    }

    setBooks(result.data.books);
    setTotalBooks(result.data.total);
    setIsLoading(false);
  }, [backend.books, pagination]);

  useEffect(() => {
    fetchBooks();
    setTitles({ title: 'Libros en el inventario' });
  }, [fetchBooks, setTitles]);

  return (
    <LocalBooksListComp
      isLoading={isLoading}
      books={books}
      total={totalBooks}
      setPagination={setPagination}
      pagination={pagination}
    />
  );
};

export default LocalBooksList;
