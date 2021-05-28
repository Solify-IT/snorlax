import {
  Button,
  Col, Image, Row, Space, Typography,
} from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toBookUpdate } from 'src/Components/Router/routes';
import useNavigation from 'src/hooks/navigation';
import Props from './FormViewBook.type';

const BookDetail: React.FC<{ name: string, value?: any }> = ({ name, value }) => (
  <>
    <Typography.Text strong>{`${name}: `}</Typography.Text>
    <Typography.Text>{value || 'Vacío'}</Typography.Text>
  </>
);

const FormViewBook: React.FC<Props> = ({ book }) => {
  const { setTitles } = useNavigation();
  const history = useHistory();

  useEffect(() => {
    setTitles({
      title: 'Información de libro',
      extra: [
        <Button
          type="primary"
          onClick={() => history.push(toBookUpdate(book.id))}
        >
          Editar datos
        </Button>,
      ],
    });
    // eslint-disable-next-line
  }, []);

  return (
    <Row gutter={[32, 0]} style={{ marginTop: '48px' }}>
      <Col span={12}>
        <Typography.Title level={2}>{book.title}</Typography.Title>
        <Typography.Title type="secondary" level={4}>{book.author}</Typography.Title>
        <Space direction="vertical">
          <BookDetail name="Sinópis" value={book.synopsis} />
          <BookDetail name="Editorial" value={book.editoral} />
          <BookDetail name="Área" value={book.area} />
          <BookDetail name="Tema" value={book.theme} />
          <BookDetail name="Proveedor" value={book.provider} />
        </Space>
      </Col>
      <Col
        span={12}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          width="50%"
          src={book.coverImageUrl}
          preview={false}
        />
      </Col>
    </Row>
  );
};

export default FormViewBook;
