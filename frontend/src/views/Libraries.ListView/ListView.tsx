import { Table } from 'antd';
import React from 'react';
import Props from './ListView.type';

const LibrariesListView: React.FC<Props> = ({ libraries, isLoading }) => {
  const columns = [
    
  ];

  return (
    <Table columns={columns} />
  );
};

export default LibrariesListView;
