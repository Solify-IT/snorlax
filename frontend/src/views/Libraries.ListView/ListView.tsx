import { Table, Typography } from 'antd';
import React from 'react';
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
  ];

  return (
    <Table columns={columns} dataSource={libraries} loading={isLoading} />
  );
};

export default LibrariesListView;
