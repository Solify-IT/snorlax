import { DeleteFilled } from '@ant-design/icons';
import {
  Button,
  InputNumber, Popconfirm, Table, Typography,
} from 'antd';
import Search from 'antd/lib/input/Search';
import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from 'src/@types';
import { toBookDetail } from 'src/Components/Router/routes';
import formatISBN from 'src/utils/isbn';

type ShoppingCartBook = { book: Book, amount: number };

interface Props {
  books: ShoppingCartBook[];
  fetchBook(isbn: string): void;
  updateAmount(bookId: string): (amount: number | null) => void;
  remove(bookId: string): () => void;
  isLoading: boolean;
}

const ShoppingCart: React.FC<Props> = ({
  books, fetchBook, updateAmount, remove, isLoading,
}) => {
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
      title: 'Cantidad',
      dataIndex: '',
      key: 'view',
      render: (row: ShoppingCartBook) => (
        <InputNumber onChange={updateAmount(row.book.id)} value={row.amount} />
      ),
    },
    {
      title: '¿Eliminar?',
      dataIndex: '',
      key: 'view',
      render: (row: ShoppingCartBook) => (
        <Popconfirm
          title="¿Deseas eliminar el libro de la compra?"
          okText="Sí, eliminar"
          cancelText="¡No!"
          onConfirm={remove(row.book.id)}
        >
          <Button type="primary" shape="circle" icon={<DeleteFilled />} />
        </Popconfirm>
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
        rowKey={(book) => book.book.id}
        loading={isLoading}
        dataSource={books}
        columns={columns}
        pagination={false}
      />
    </>
  );
};

export default ShoppingCart;
