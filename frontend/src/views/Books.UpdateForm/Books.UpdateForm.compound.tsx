import { notification } from 'antd';
import React, { useCallback, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import { Book } from 'src/@types';
// import { LIST_LOCAL_BOOKS } from 'src/Components/Router/routes';
import BooksUpdateForm from './Books.UpdateForm';
import { StateType } from './Books.Update.type';

const UpdateForm: React.FC = () => {
  const history = useHistory();
  const backend = useBackend();
  const [isLoading, setIsLoading] = useState(false);
  const { setTitles } = useNavigation();
  const [book, setBook] = useState< Book | undefined >(undefined);
  const { id } = useParams<{ id: string }>();

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

  const onFinish = async (values: StateType) => {
    setIsLoading(true);
    console.log(values);
    /*
    const [result, error] = await backend.books.updateOne({ values });

    if (error) {
      notification.error({
        message: '¡Ocurrió un error al guardar!',
        description: 'Intentalo después.',
      });
    }
    if (result) {
      notification.success({
        message: '¡Usuario modificado!',
        description: 'Puedes modificar más usuarios o verificar el detalle del usuario.',
      });
    }
*/
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
