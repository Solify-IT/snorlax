import { notification } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Book } from 'src/@types';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import useMetadataProvider from 'src/integrations/metadataProvider';
import FormViewBookComp from './FormViewBook';

const FormViewBook: React.FC = () => {
  const metadataClient = useMetadataProvider();
  const [book, setBook] = useState<Book | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const backend = useBackend();
  const { setTitles } = useNavigation();
  const { id } = useParams<{ id: string }>();
  const fetchBooks = useCallback(async () => {
    setIsLoading(true);

    const [result, error] = await backend.books.getOneById<{ books: Book }>(id);

    if (error || !result) {
      notification.error({
        message: 'Error al cargar informacion del libro',
        description: 'Intentalo más tarde.',
      });
      setIsLoading(false);
      return;
    }
    console.log(result.data);
    const [metadata, metadataError] = await metadataClient.getByISBN(result.data.books.isbn);
    if (metadataError || !metadata) {
      notification.error({
        message: 'Error al cargar informacion del libro',
        description: 'Intentalo más tarde.',
      });
      setIsLoading(false);
      return;
    }
    console.log(metadata);
    setBook(result.data.books);
    setIsLoading(false);
  }, [backend.books]);

  useEffect(() => {
    setTitles({ title: 'Libro' });
    fetchBooks();
  }, [fetchBooks, setTitles]);
  if (!book) {
    return null;
  }
  return (
    <FormViewBookComp book={book} isLoading={isLoading} />
  );
};
export default FormViewBook;
