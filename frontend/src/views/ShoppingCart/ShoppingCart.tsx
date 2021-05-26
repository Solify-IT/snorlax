import {
  InputNumber, Table, Tag, Typography,
} from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Book } from 'src/@types';
import { toBookDetail } from 'src/Components/Router/routes';
import formatISBN from 'src/utils/isbn';

type ShoppingCartBook = { book: Book, amount: number };

interface Props {
  books: ShoppingCartBook[];
  fetchBook(isbn: string): void;
}

const ShoppingCart: React.FC<Props> = ({ books, fetchBook }) => {
  const [isLoading] = useState(false);
  const history = useHistory();

  const goTo = (path: string) => () => history.push(path);

  const columns = [
    {
      title: 'Title',
      dataIndex: ['book', 'title'],
      key: 'title',
      render: (title: string, row: ShoppingCartBook) => (
        <Link to={toBookDetail(row.book.id)}>{title}</Link>
      ),
    },
    {
      title: 'ISBN',
      dataIndex: ['book', 'isbn'],
      key: 'isbn',
      render: (isbn: string) => <Typography.Text>{formatISBN(isbn)}</Typography.Text>,
      width: 200,
    },
    {
      title: 'Precio',
      dataIndex: ['book', 'price'],
      key: 'price',
      render: (price: string) => (
        <Typography.Text>
          $
          {price}
        </Typography.Text>
      ),
      width: 100,
    },
    {
      title: 'Autores',
      dataIndex: ['book', 'author'],
      key: 'author',
      render: (author?: string) => (
        <>
          {author && author.split(', ').map(
            (a) => <Tag key={a}>{a}</Tag>,
          )}
        </>
      ),
    },
    {
      title: 'Disponibilidad',
      dataIndex: ['book', 'price'],
      key: 'price',
      render: (price: string) => (
        <Typography.Text>

          {price}
          pz
        </Typography.Text>
      ),
      width: 100,
    },
    {
      title: 'Cantidad',
      dataIndex: '',
      key: 'view',
      render: (row: ShoppingCartBook) => (
        <InputNumber value={row.amount} />
      ),
    },
  ];

  const onSearch = (value?: string) => value && fetchBook(value);

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newVal = e.target.value;
    if (newVal.length !== 13) {
      return;
    }

    fetchBook(newVal);
  };

  return (
    <>
      <Search
        allowClear
        enterButton="Añadir"
        size="large"
        placeholder="Ingresa el ISBN del libro a vender"
        onSearch={onSearch}
        loading={isLoading}
        onChange={onSearchChange}
        style={{ margin: '12px 0 24px 0' }}
      />

      <Table
        loading={isLoading}
        dataSource={books}
        columns={columns}
      />
    </>
  );
};

export default ShoppingCart;
