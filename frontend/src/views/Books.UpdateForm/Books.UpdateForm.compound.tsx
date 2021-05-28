import { notification } from 'antd';
import React, { useCallback, useState, useEffect } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import { Book, BookFormType } from 'src/@types';
import useAuth from 'src/hooks/auth';
import { SIGN_IN } from 'src/Components/Router/routes';
import BooksUpdateForm from './Books.UpdateForm';

const UpdateForm: React.FC = () => {
  const history = useHistory();
  const backend = useBackend();
  const [isLoading, setIsLoading] = useState(false);
  const { setTitles } = useNavigation();
  const [book, setBook] = useState< Book | undefined >(undefined);
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const fetchBook = useCallback(async () => {
    setIsLoading(true);

    const [result, error] = await backend.books.getOneById<{ book: Book }>(id);

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar el libro!',
        description: 'Intentalo más tarde',
      });
      setIsLoading(false);
      return;
    }

    setBook(result.data.book);
    setIsLoading(false);
  }, [backend.books]);

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

  if (!user) return <Redirect to={SIGN_IN} />;

  const onFinish = async (values: BookFormType) => {
    setIsLoading(true);

    const [result, error] = await backend.books.updateOne(id, {
      ...values, libraryId: user.libraryId, id,
    });

    if (error) {
      notification.error({
        message: '¡Ocurrió un error al guardar!',
        description: 'Intentalo después.',
      });
    }
    if (result) {
      notification.success({
        message: 'Lirbo modificado!',
      });
    }

    setIsLoading(false);
  };

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
