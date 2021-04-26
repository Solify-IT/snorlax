import {
  Table, Tag, Typography, Button, Tooltip, Modal,
} from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SearchOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Book } from 'src/@types';
import { toBookDetail } from 'src/Components/Router/routes';
import formatISBN from 'src/utils/isbn';
import Props from './LocalBooksList.type';

const LocalBooksList: React.FC<Props> = ({
  isLoading, books, total, setPagination, pagination,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
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
      render: () => (
        <>
          <Tooltip title="search">
            <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={showModal} />
          </Tooltip>
          <Modal title="Informacion de libro" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>
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
