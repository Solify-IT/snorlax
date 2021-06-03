import { message, notification } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Book } from 'src/@types';
import { SIGN_IN } from 'src/Components/Router/routes';
import useAuth from 'src/hooks/auth';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import { SHOW_RETURNS_CART } from 'src/utils/featureToggles';
import ReturnsCartComp from './ReturnsCart';

const ReturnsCart: React.FC = () => {
  const { user, getHomeForRole } = useAuth();
  const { setTitles } = useNavigation();
  const [books, setBooks] = useState<{ book: Book, amount: number }[]>();
  const backend = useBackend();
  const [isLoading, setIsLoading] = useState(false);
  const total = useMemo(() => {
    let tot = 0;
    books?.forEach((b) => {
      tot += b.amount * b.book.price;
    });
    return tot;
  }, [books]);

  useEffect(() => {
    if (!user || !SHOW_RETURNS_CART) return;

    setTitles({
      title: 'Devoluciones de Libros',
      subtitle: 'Añade libros por su ISBN',
    });
  }, []);

  if (!user) {
    message.error('No tienes acceso.');
    return <Redirect to={SIGN_IN} />;
  }

  if (!SHOW_RETURNS_CART) {
    return <Redirect to={getHomeForRole(user.role.name)} />;
  }

  const updateAmount = (bookId: string) => (amount: number | null) => {
    if (!books) return;

    if (!amount) {
      setBooks(books.map((b) => (
        b.book.id === bookId ? { book: b.book, amount: 1 } : b
      )));
      return;
    }

    setBooks(books.map((b) => (
      b.book.id === bookId ? { book: b.book, amount } : b
    )));
  };

  const remove = (bookId: string) => () => {
    if (!books) return;

    setBooks(books.filter((b) => (
      b.book.id !== bookId
    )));

    message.success('Devolucion de libro cancelada');
  };

  const fetchBook = async (isbn: string) => {
    setIsLoading(true);
    if (isbn.length !== 13) {
      message.warning('El ISBN no es válido');
      setIsLoading(false);
      return;
    }

    const [res, err] = await backend.books.getAll<{
      total: number,
      books: Book[],
    }>(`libraryId=${user.libraryId}&isbn=${isbn}`);

    if (err || !res || (res.status !== 404 && res.status !== 200)) {
      message.error('¡Error al obtener el libro!');
      setIsLoading(false);
      return;
    }

    if (res.status === 404 || res.data.books.length !== 1) {
      message.warn('¡No se encontró el libro!');
      setIsLoading(false);
      return;
    }

    const newBook = { book: res.data.books[0], amount: 1 };

    if (books) {
      const alreadyExists = books.findIndex((b) => b.book.id === newBook.book.id);

      if (alreadyExists !== -1) {
        updateAmount(newBook.book.id)(books[alreadyExists].amount + 1);
        setIsLoading(false);
        return;
      }

      setBooks([...books, newBook]);
      setIsLoading(false);
      return;
    }
    setBooks([newBook]);
    setIsLoading(false);
  };

  const onFinishReturn = async () => {
    if (!books) return;
    setIsLoading(true);

    const payload: { id: string, amount: number }[] = [];

    books.forEach((b) => {
      payload.push({ id: b.book.id, amount: b.amount });
    });

    const [res, err] = await backend.libraries.post<
    { status: number }, { books: typeof payload }
    >('/return', { books: payload });

    if (err || !res || res.data.status !== 200) {
      notification.error({ message: 'Ocurrió un error al completar la devolucion' });
      setIsLoading(false);
      return;
    }

    notification.success({ message: 'Devolucion completada exitosamente' });
    setBooks([]);
    setIsLoading(false);
  };

  return (
    <ReturnsCartComp
      updateAmount={updateAmount}
      books={books || []}
      fetchBook={fetchBook}
      remove={remove}
      isLoading={isLoading}
      total={total}
      onFinishSale={onFinishReturn}
    />
  );
};

export default ReturnsCart;
