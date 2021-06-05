import {
  Button, notification, Switch,
} from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Book } from 'src/@types';
import { NEW_BOOK } from 'src/Components/Router/routes';
import useAuth from 'src/hooks/auth';
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
  const [isbn, setIsbn] = useState('');
  const [isGlobal, setIsGlobal] = useState(false);
  const history = useHistory();
  const { user } = useAuth();

  const fetchBooks = useCallback(async (currIsbn?: string) => {
    setIsLoading(true);

    const [result, error] = await backend.books.getAll<{
      total: number,
      books: Book[],
    }>(`${isGlobal ? '' : `libraryId=${user?.libraryId}&`}${currIsbn ? `isbn=${currIsbn}&` : ''}page=${pagination.page}&perPage=${pagination.perPage}`);

    if (error || !result) {
      notification.error({ message: 'Ocurrió un error al obtener la lista de libros' });
      return;
    }

    setBooks(result.data.books);
    setTotalBooks(result.data.total);
    setIsLoading(false);
  }, [backend.books, pagination, isGlobal]);

  useEffect(() => {
    if ((!isGlobal && !isbn) || (isGlobal && isbn)) {
      fetchBooks(isbn);
    }
    setTitles({
      title: 'Consulta disponibilidad de libros',
      extra: [
        <Button type="primary" onClick={() => history.push(NEW_BOOK)}>
          Registrar entrada de libro
        </Button>,
      ],
    });
  }, [fetchBooks, setTitles, history]);

  if (!user) {
    notification.error({ message: 'No tienes permisos para acceder' });
    return null;
  }

  const onSearch = async (currIsbn?: string) => (currIsbn ? fetchBooks(currIsbn) : null);

  return (
    <>
      <Search
        allowClear
        enterButton="Buscar"
        size="large"
        placeholder="Ingresa el ISBN,autor o titulo a buscar"
        onSearch={onSearch}
        loading={isLoading}
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        suffix={(
          <Switch
            checkedChildren="Búsqueda Global"
            unCheckedChildren="Búsqueda Local"
            onChange={(checked) => setIsGlobal(checked)}
          />
        )}
        style={{ margin: '12px 0 24px 0' }}
      />

      <LocalBooksListComp
        isLoading={isLoading}
        books={books}
        total={totalBooks}
        setPagination={setPagination}
        pagination={pagination}
      />
    </>
  );
};

export default LocalBooksList;
