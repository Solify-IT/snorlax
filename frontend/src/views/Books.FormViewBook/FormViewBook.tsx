import {
  Button,
  Col, Divider, List, Row,
} from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toBookUpdate } from 'src/Components/Router/routes';
import useNavigation from 'src/hooks/navigation';
import Props from './FormViewBook.type';

const INITIAL_STATE = {
  isbn: '',
  price: 0,
  amount: 1,
  isLoan: false,
};

const FormViewBook: React.FC<Props> = ({ book }) => {
  const { setTitles } = useNavigation();
  const history = useHistory();

  useEffect(() => {
    setTitles({
      title: book.title,
      subtitle: book.author,
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
  }, [INITIAL_STATE]);

  const data = [
    <b>Titulo </b>,
    <b>Precio </b>,
    <b>Autor</b>,
    <b>Costo Unitario</b>,
    <b>Proveedor</b>,
  ];

  const dat = [
    book.title,
    book.price,
    book.author,
    book.unitaryCost,
    book.provider,
  ];
  return (
    <Row justify="space-around" align="middle">
      <Col span={6}>
        <Divider orientation="left">Titulos</Divider>
        <List
          header={<div>--------------------------------------</div>}
          footer={<div>--------------------------------------</div>}
          dataSource={data}
          bordered
          size="large"
          renderItem={(item) => (
            <List.Item>
              {item}
            </List.Item>
          )}
        />
      </Col>
      <Col span={14}>
        <Divider orientation="left">Detalles</Divider>
        <List
          header={<div>--------------------------------------</div>}
          footer={<div>--------------------------------------</div>}
          dataSource={dat}
          bordered
          size="large"
          renderItem={(item) => (
            <List.Item>
              {item}
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
};

export default FormViewBook;
