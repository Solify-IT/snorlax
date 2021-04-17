import { Table, Typography } from 'antd';
import React from 'react';
import { Book } from 'src/@types';
import { toBookDetail } from 'src/Components/Router/routes';
import formatISBN from 'src/utils/isbn';
import Props from './LocalBooksList.type';

const LocalBooksList: React.FC<Props> = ({ isLoading, books }) => {
  const columns = [
    {
      title: 'ISBN',
      dataIndex: 'isbn',
      key: 'isbn',
      render: (isbn: string) => <Typography.Text>{formatISBN(isbn)}</Typography.Text>,
    },
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
  ];

  return (
    <Table loading={isLoading} dataSource={books} columns={columns} />
  );
};

export default LocalBooksList;
