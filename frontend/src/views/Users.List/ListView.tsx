import { Table, Typography } from 'antd';
import React from 'react';
import { StoredUser } from 'src/@types/user';
import { toUserDetail } from 'src/Components/Router/routes';

interface Props {
  users: StoredUser[];
  loading: boolean;
}

// {
//   "id": "ddf128b6-8c5e-4ff7-8a48-035eeba920d4",
//   "createdAt": "2021-04-20T23:24:41.131Z",
//   "updatedAt": "2021-04-20T23:24:41.131Z",
//   "email": "nokoayzack@gmail.com",
//   "displayName": "Topi",
//   "disabled": false,
//   "roleId": "e450d7e3-05a7-4750-8791-de92772d4275",
//   "libraryId": "e11e5635-094c-4224-836f-b0caa13986f3"
// },

const columns = [
  {
    title: 'Nombre',
    dataIndex: 'displayName',
    key: 'displayName',
    render: (name: string, row: StoredUser) => (
      <Typography.Link href={toUserDetail(row.id)}>
        {name}
      </Typography.Link>
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
    title: 'Estado',
    dataIndex: 'disabled',
    key: 'disabled',
    render: (disabled: boolean) => (
      <Typography.Text>
        {disabled ? 'Desactivado' : 'Activo'}
      </Typography.Text>
    ),
  },
];

const ListView: React.FC<Props> = ({ users, loading }) => (
  <Table dataSource={users} loading={loading} columns={columns} />
);

export default ListView;
