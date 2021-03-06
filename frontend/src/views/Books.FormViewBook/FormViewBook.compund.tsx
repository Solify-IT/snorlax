import { notification } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Book } from 'src/@types';
import Loader from 'src/Components/Loader';
import { useBackend } from 'src/integrations/backend';
import FormViewBookComp from './FormViewBook';

const FormViewBook: React.FC = () => {
  const [book, setBook] = useState<Book | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const backend = useBackend();
  const { id } = useParams<{ id: string }>();

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);

    const [result, error] = await backend.books.getOneById<{ book: Book }>(id);

    if (error || !result) {
      notification.error({
        message: 'Error al cargar informacion del libro',
        description: 'Intentalo más tarde.',
      });
      setIsLoading(false);
      return;
    }

    setBook(result.data.book);
    setIsLoading(false);
  }, [backend.books]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  if (isLoading) return <Loader isLoading />;

  if (!book) {
    return null;
  }

  return (
    <FormViewBookComp book={book} isLoading={isLoading} />
  );
};
export default FormViewBook;
