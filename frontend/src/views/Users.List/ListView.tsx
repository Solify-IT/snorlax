import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  Button, Col, Popconfirm, Row, Table, Tooltip, Typography,
} from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { StoredUser } from 'src/@types/user';
import { toUserDetail } from 'src/Components/Router/routes';

interface Props {
  users: StoredUser[];
  loading: boolean;
  onFinishDrop(id: string): Promise<void>;
}

const ListView: React.FC<Props> = ({ users, loading, onFinishDrop }) => {
  const history = useHistory();
  const goTo = (path: string) => () => history.push(path);
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
      title: 'Acciones',
      dataIndex: '',
      key: 'view',
      render: (row: StoredUser) => (
        <Row>
          <Col span={12}>
            <Tooltip title="Editar usuario">
              <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={goTo(toUserDetail(row.id))} />
            </Tooltip>
          </Col>
          <Col span={12}>
            <Tooltip title="Eliminar">
              <Popconfirm
                title="¿Deseas Eliminar Usuario?"
                okText="Sí, Terminar"
                cancelText="No"
                onConfirm={() => {
                  onFinishDrop(row.id);
                }}
              >
                <Button type="primary" shape="circle" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          </Col>

        </Row>
      ),
    },
  ];
  return (
    <Table dataSource={users} loading={loading} columns={columns} />
  );
};

export default ListView;
