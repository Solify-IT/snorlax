import { message, notification } from 'antd';
import React, {
  useEffect, useMemo, useState, useCallback,
} from 'react';
import { Redirect } from 'react-router-dom';
import { Book } from 'src/@types';
import { SIGN_IN } from 'src/Components/Router/routes';
import useAuth from 'src/hooks/auth';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import { SHOW_SHOPPING_CART } from 'src/utils/featureToggles';
import {
  AggregatedSale,
} from 'src/@types/movement';
import ShoppingCartComp from './ShoppingCart';

const ShoppingCart: React.FC = () => {
  const { user, getHomeForRole } = useAuth();
  const { setTitles } = useNavigation();
  const [books, setBooks] = useState<{ book: Book, amount: number, total:number }[]>();
  const backend = useBackend();
  const [isLoading, setIsLoading] = useState(false);
  const [ticketData, setTicketData] = useState<{
    libraryName: string, books: any, total: number, state:string,
    celular:string, correo:string, ciudad:string, nombre:string,fecha:string } | null>(null);
  const [sales, setSales] = useState<Array<AggregatedSale>>([]);
  const fetchTodaySale = useCallback(
    async () => {
      const [res] = await backend.todaySale.getAllObject(`date=${Date.now()}&libraryId=${user?.libraryId}`);
      if (res != null) {
        setSales(res.data.sale);
      }
    }, [setSales],
  );

  useEffect(() => {
    fetchTodaySale();
  }, [fetchTodaySale]);
  const total = useMemo(() => {
    let tot = 0;
    books?.forEach((b) => {
      tot += b.amount * b.book.price;
    });
    return tot;
  }, [books]);

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
        b.book.id === bookId ? { book: b.book, amount: 1, total: b.book.price } : b
      )));
      return;
    }

    setBooks(books.map((b) => (
      b.book.id === bookId ? { book: b.book, amount, total: b.book.price } : b
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
    setTicketData(null);
    setIsLoading(true);

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

    const newBook = { book: res.data.books[0], amount: 1, total: res.data.books[0].price };

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

  const onFinishSale = async () => {
    if (!books) return;
    setIsLoading(true);

    const payload: { id: string, amount: number, total:number }[] = [];

    books.forEach((b) => {
      payload.push({ id: b.book.id, amount: b.amount, total: b.total });
    });

    const [res, err] = await backend.libraries.post<
    { status: number }, { books: typeof payload }
    >('/sell', { books: payload });

    if (err || !res || res.data.status !== 200) {
      notification.error({ message: 'Ocurrió un error al completar la venta' });
      setIsLoading(false);
      return;
    }

    fetchTodaySale();
    notification.success({ message: 'Venta completada exitosamente' });
    let utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    setTicketData({
      libraryName: user.library.name,
      books: [...books],
      total,
      state: user.library.state,
      celular: user.library.phoneNumber,
      correo: user.library.email,
      ciudad: user.library.city,
      nombre: user.name,
      fecha: utc,
    });
    setBooks([]);
    setIsLoading(false);
  };

  return (
    <ShoppingCartComp
      updateAmount={updateAmount}
      books={books || []}
      fetchBook={fetchBook}
      remove={remove}
      isLoading={isLoading}
      total={total}
      onFinishSale={onFinishSale}
      ticketData={ticketData}
      todaySale={sales}
    />
  );
};

export default ShoppingCart;
