import { notification } from 'antd';
import React, { useCallback, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import { Book } from 'src/@types';
import useMetadataProvider from 'src/integrations/metadataProvider';
import { LIST_LOCAL_BOOKS } from 'src/Components/Router/routes';
import BooksUpdateForm from './Books.UpdateForm';
import { StateType } from './Books.Update.type';

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

  const onFinish = async (values: StateType) => {
    setIsLoading(true);
    const [, error] = await backend.books.createOne({
      ...values,
      libraryId: 'e11e5635-094c-4224-836f-b0caa13986f3',
      amount: Math.abs(values.amount - values.newAmount),
    });

    if (error) {
      notification.error({
        message: '¡Ocurrió un error al guardar!',
        description: 'Intentalo después.',
      });
    } else {
      notification.success({
        message: '¡Cambios guardados!',
        description: '',
      });
      history.push(LIST_LOCAL_BOOKS);
    }

    setIsLoading(false);
  };

  const onFinishFailed = () => {
    notification.error({
      message: '¡Ocurrió un error al guardar!',
      description: 'Intentalo después.',
    });
  };

  useEffect(() => {
    setTitles({
      title: 'Modificar Libro en Inventario',
    });
    fetchBook();
  }, [setTitles, history, fetchBook]);
  if (!book) {
    return null;
  }

  return (
    <BooksUpdateForm
      book={book}
      isLoading={isLoading}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    />
  );
};

export default UpdateForm;
