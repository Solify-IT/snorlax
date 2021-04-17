import React, { useCallback, useEffect, useState } from 'react';
import { notification } from 'antd';
import { ExternalBook } from 'src/@types';
import useMetadataProvider from 'src/integrations/metadataProvider';
import PassedProps from './PossibleBooks.type';
import PossibleBooksComponent from './PossibleBooks';
import Loader from '../Loader';

const PossibleBooks: React.FC<PassedProps> = ({ isbn }) => {
  const [books, setBooks] = useState<ExternalBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const metadataClient = useMetadataProvider();

  const fetchBooksByISBN = useCallback(async () => {
    setIsLoading(true);
    const [res, error] = await metadataClient.getByISBN(isbn);

    if (error || !res) {
      notification.error({
        message: 'Ocurrió un error al cargar los libros',
      });
    } else {
      setBooks(res);
    }
    setIsLoading(false);
  }, [isbn, metadataClient]);

  useEffect(() => {
    if (isbn.length === 13) {
      fetchBooksByISBN();
    }
  }, [isbn, fetchBooksByISBN]);

  if (isbn.length !== 13) return null;

  if (isLoading) return <Loader isLoading={isLoading} />;

  return <PossibleBooksComponent books={books} />;
};

export default PossibleBooks;
