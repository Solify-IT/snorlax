import { Table, Tag, Typography } from 'antd';
import React from 'react';
import { Book } from 'src/@types';
import { toBookDetail } from 'src/Components/Router/routes';
import formatISBN from 'src/utils/isbn';
import Props from './LocalBooksList.type';

const LocalBooksList: React.FC<Props> = ({
  isLoading, books, total, setPagination, pagination,
}) => {
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
  ];

  return (
    <Table
      rowKey="id"
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
