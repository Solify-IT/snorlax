import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button, Col, Row, Table, Tag, Tooltip, Typography,
} from 'antd';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Book } from 'src/@types';
import { toBookDetail, toBookUpdate } from 'src/Components/Router/routes';
import formatISBN from 'src/utils/isbn';
import Props from './LocalBooksList.type';

const LocalBooksList: React.FC<Props> = ({
  isLoading, books, total, setPagination, pagination,
}) => {
  const history = useHistory();
  const goTo = (path: string) => () => history.push(path);
  const columns = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, row: Book) => (
        <Link to={toBookDetail(row.id)}>{title}</Link>
      ),
    },
    {
      title: 'ISBN',
      dataIndex: 'isbn',
      key: 'isbn',
      render: (isbn: string) => <Typography.Text>{formatISBN(isbn)}</Typography.Text>,
      width: 200,
    },
    {
      title: 'Precio',
      dataIndex: 'price',
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
      dataIndex: 'author',
      key: 'author',
      render: (author: string) => (
        <>
          {author.split(', ').map(
            (a) => <Tag key={a}>{a}</Tag>,
          )}
        </>
      ),
    },
    {
      title: 'Disponibilidad',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Typography.Text>
          {amount}
          pz
        </Typography.Text>
      ),
      width: 100,
    },

    {
      title: 'Acciones',
      dataIndex: '',
      key: 'view',
      render: (row: Book) => (
        <Row>
          <Col span={12}>
            <Tooltip title="Ver detalles">
              <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={goTo(toBookDetail(row.id))} />
            </Tooltip>
          </Col>
          <Col span={12}>
            <Tooltip title="Editar">
              <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={goTo(toBookUpdate(row.id))} />
            </Tooltip>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <Table
      loading={isLoading}
      dataSource={books}
      columns={columns}
      pagination={{
        total,
        showSizeChanger: true,
        onChange: (page, pageSize) => setPagination({
          page, perPage: pageSize || pagination.perPage,
        }),
        onShowSizeChange: (_, size) => setPagination({ ...pagination, perPage: size }),
      }}
    />
  );
};

export default LocalBooksList;
