import { notification } from 'antd';
import React, { useCallback, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import { Book } from 'src/@types';
import useMetadataProvider from 'src/integrations/metadataProvider';
import BooksUpdateForm from './Books.UpdateForm';

const UpdateForm: React.FC = () => {
  const metadataClient = useMetadataProvider();
  const history = useHistory();
  const backend = useBackend();
  const [isLoading, setIsLoading] = useState(false);
  const { setTitles } = useNavigation();
  const [book, setBook] = useState< Book | undefined >(undefined);
  const { id } = useParams<{ id: string }>();

  const fetchBook = useCallback(async () => {
    setIsLoading(true);

    const [result, error] = await backend.books.getOneById<{ books: Book }>(id);

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar el libro!',
        description: 'Intentalo más tarde',
      });
      setIsLoading(false);
      return;
    }

    const [metadata, metadataError] = await metadataClient.getByISBN(result.data.books.isbn);
    if (metadataError || !metadata) {
      notification.error({
        message: 'Ocurrió un error al cargar el libro!',
        description: 'Intentalo más tarde',
      });
      setIsLoading(false);
      return;
    }

    setBook(result.data.books);
    setIsLoading(false);
  }, [backend.books]);

  useEffect(() => {
    setTitles({
      title: 'Modificar Libro en Inventario',
    });
    fetchBook();
  }, [setTitles, history, fetchBook]);

  return (
    <BooksUpdateForm book={book} isloading={isLoading} />
  );
};

export default UpdateForm;
