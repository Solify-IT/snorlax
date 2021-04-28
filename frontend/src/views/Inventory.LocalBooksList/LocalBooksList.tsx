import {
  Table, Tag, Typography, Button, Tooltip,
} from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SearchOutlined } from '@ant-design/icons';
import React from 'react';
import { Book } from 'src/@types';
import { toBookDetail } from 'src/Components/Router/routes';
import { useHistory } from 'react-router-dom';
import formatISBN from 'src/utils/isbn';
import Props from './LocalBooksList.type';

const LocalBooksList: React.FC<Props> = ({
  isLoading, books, total, setPagination, pagination,
}) => {
  const history = useHistory();

  const goTo = (path: string) => () => history.push(path);
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, row: Book) => (
        <Typography.Link href={toBookDetail(row.id)}>
          {title}
        </Typography.Link>
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
      dataIndex: 'authors',
      key: 'authors',
      render: (authors: string[]) => (
        <>
          {authors.map(
            (author) => <Tag key={author}>{author}</Tag>,
          )}
        </>
      ),
    },
    {
      title: '',
      dataIndex: '',
      key: 'view',
      render: (row: Book) => (
        <>
          <Tooltip title="search">
            <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={goTo(toBookDetail(row.id))} />
          </Tooltip>
        </>
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
