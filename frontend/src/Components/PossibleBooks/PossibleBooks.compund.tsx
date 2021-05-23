import React, { useCallback, useEffect, useState } from 'react';
import { notification } from 'antd';
import { Catalogue, ExternalBook } from 'src/@types';
import { useBackend } from 'src/integrations/backend';
import useMetadataProvider from 'src/integrations/metadataProvider';
import PassedProps from './PossibleBooks.type';
import PossibleBooksComponent from './PossibleBooks';

const PossibleBooks: React.FC<PassedProps> = ({ isbn, setSelected }) => {
  const [externalBooks, setExternalBooks] = useState<ExternalBook[]>([]);
  const [internalBooks, setInternalBooks] = useState<Catalogue | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const metadataClient = useMetadataProvider();
  const backend = useBackend();

  const fetchBooksByISBN = useCallback(async () => {
    setIsLoading(true);
    const [resExternal, resInternal] = await Promise.all([
      metadataClient.getByISBN(isbn),
      backend.catalogue.getOneById<{ catalogue: Catalogue }>(isbn),
    ]);

    if (resExternal[1] || !resExternal[0]) {
      notification.error({
        message: 'Ocurrió un error al cargar metadatos externos.',
      });
    } else {
      setExternalBooks(resExternal[0]);
    }

    if (resInternal[1]?.response?.status === 404) {
      setInternalBooks(undefined);
    } else if (resInternal[1] || !resInternal[0]) {
      notification.error({
        message: 'Ocurrió un error al cargar metadatos externos.',
      });
    } else {
      setInternalBooks(resInternal[0].data.catalogue);
    }
    setIsLoading(false);
  }, [isbn, metadataClient, backend.catalogue]);

  useEffect(() => {
    if (isbn.length === 13) {
      fetchBooksByISBN();
    }

    if (!internalBooks) setSelected({ selected: undefined, type: undefined });
  }, [isbn, fetchBooksByISBN]);

  if (isbn.length !== 13) return null;

  return (
    <PossibleBooksComponent
      setSelected={setSelected}
      internalBook={internalBooks}
      externalBooks={externalBooks}
      isLoading={isLoading}
    />
  );
};

export default PossibleBooks;
