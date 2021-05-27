import { Table, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { Library } from 'src/@types';
import { toLibraryDetail } from 'src/Components/Router/routes';
import Props from './ListView.type';

const LibrariesListView: React.FC<Props> = ({ libraries, isLoading }) => {
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, row: Library) => (
        <Typography.Link href={toLibraryDetail(row.id)}>
          {name}
        </Typography.Link>
      ),
    },
    {
      title: 'A Cargo',
      dataIndex: 'inCharge',
      key: 'inCharge',
    },
    {
      title: 'Teléfono',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Ciudad',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Modificar Libreria',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (name: string, row: Library) => (
        <Link to={toLibraryDetail(row.id)}>Modificar</Link>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={libraries}
      loading={isLoading}
    />
  );
};

export default LibrariesListView;
