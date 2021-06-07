import { Table } from 'antd';
import React from 'react';
import { Movement } from 'src/@types';

interface Props {
  movements: Movement[];
  loading: boolean;
}

const ListView: React.FC<Props> = ({ movements, loading }) => {
  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
    },
    {
      title: 'Tipo',
      dataIndex: 'typ',
      key: 'typ',
      filters: [
        {
          text: 'Devolucion cliente',
          value: 'Devolucion cliente',
        },
        {
          text: 'Compra',
          value: 'Compra',
        },
        {
          text: 'Venta',
          value: 'Venta',
        },
        {
          text: 'Devolucion Editorial',
          value: 'Devolucion Editorial',
        },
        {
          text: 'Actualizar',
          value: 'Actualizar',
        },
      ],
      onFilter: (value: any, record: any) => record.typ === value,
    },
    {
      title: 'Registros',
      dataIndex: 'totalCount',
      key: 'totalCount',
    },
    {
      title: 'Cantidad',
      dataIndex: 'units',
      key: 'units',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
  ];
  return (
    <Table
      dataSource={movements}
      loading={loading}
      columns={columns}
    />
  );
};

export default ListView;
