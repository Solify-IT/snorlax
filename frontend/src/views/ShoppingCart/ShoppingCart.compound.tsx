import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Book } from 'src/@types';
import { SIGN_IN } from 'src/Components/Router/routes';
import useAuth from 'src/hooks/auth';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import { SHOW_SHOPPING_CART } from 'src/utils/featureToggles';
import ShoppingCartComp from './ShoppingCart';

const ShoppingCart: React.FC = () => {
  const { user, getHomeForRole } = useAuth();
  const { setTitles } = useNavigation();
  const [books, setBooks] = useState<{ book: Book, amount: number }[]>();
  const backend = useBackend();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || !SHOW_SHOPPING_CART) return;

    setTitles({
      title: 'Punto de venta',
      subtitle: 'Añade libros por su ISBN',
    });
  }, []);

  if (!user) {
    message.error('No tienes acceso.');
    return <Redirect to={SIGN_IN} />;
  }

  if (!SHOW_SHOPPING_CART) {
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

    message.success('Compra de libro cancelada');
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

  return (
    <ShoppingCartComp
      updateAmount={updateAmount}
      books={books || []}
      fetchBook={fetchBook}
      remove={remove}
      isLoading={isLoading}
    />
  );
};

export default ShoppingCart;