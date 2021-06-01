import { Table, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { StoredUser } from 'src/@types/user';
import { toUserDetail } from 'src/Components/Router/routes';

interface Props {
  users: StoredUser[];
  loading: boolean;
}

const ListView: React.FC<Props> = ({ users, loading }) => {
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (name: string) => (
        <Typography.Text>
          {name}
        </Typography.Text>
      ),
    },
    {
      title: 'Librería',
      dataIndex: ['library', 'name'],
      key: 'libraryName',
    },
    {
      title: 'Rol',
      dataIndex: ['role', 'name'],
      key: 'roleName',
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <Typography.Text>
          {email}
        </Typography.Text>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'disabled',
      key: 'disabled',
      render: (disabled: boolean) => (
        <Typography.Text>
          {disabled ? 'Desactivado' : 'Activo'}
        </Typography.Text>
      ),
    },
    {
      title: 'Modificar Usuario',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (name: string, row: StoredUser) => (
        <Link to={toUserDetail(row.id)}>Modificar</Link>
      ),
    },
  ];
  return (
    <Table dataSource={users} loading={loading} columns={columns} />
  );
};

export default ListView;
