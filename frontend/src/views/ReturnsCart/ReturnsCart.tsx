import { DeleteFilled } from '@ant-design/icons';
import {
  Button,
  Col,
  InputNumber,
  Popconfirm,
  Row,
  Table,
  Typography,
} from 'antd';
import Search from 'antd/lib/input/Search';
import React from 'react';
import { Book } from 'src/@types';
import formatISBN from 'src/utils/isbn';

type ReturnsCartBook = { book: Book, amount: number };

interface Props {
  books: ReturnsCartBook[];
  fetchBook(isbn: string): void;
  updateAmount(bookId: string): (amount: number | null) => void;
  remove(bookId: string): () => void;
  isLoading: boolean;
  total: number;
  onFinishReturn(): Promise<void>;
}

const ReturnsCart: React.FC<Props> = ({
  books, fetchBook, updateAmount, remove, isLoading, total, onFinishReturn,
}) => {
  const columns = [
    {
      title: 'Título',
      dataIndex: ['book', 'title'],
      key: 'title',
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
      render: (row: ReturnsCartBook) => (
        <InputNumber onChange={updateAmount(row.book.id)} value={row.amount} />
      ),
    },
    {
      title: '¿Eliminar?',
      dataIndex: '',
      key: 'view',
      render: (row: ReturnsCartBook) => (
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
        autoFocus
      />

      <Table
        rowKey={(book) => book.book.id}
        loading={isLoading}
        dataSource={books}
        columns={columns}
        pagination={false}
      />

      <Row style={{ margin: '24px 0' }}>
        <Col span={12}>
          <Typography.Title level={3}>
            Total:
            {` $${total}`}
          </Typography.Title>
        </Col>
        <Col
          span={12}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <span>
            <Popconfirm
              title="¿Deseas terminar la devolucion?"
              okText="Sí, Terminar"
              cancelText="No"
              disabled={!books.length}
              onConfirm={onFinishReturn}
            >
              <Button
                disabled={!books.length}
                type="primary"
              >
                Terminar Devolucion
              </Button>
            </Popconfirm>
          </span>
        </Col>
      </Row>
    </>
  );
};

export default ReturnsCart;
