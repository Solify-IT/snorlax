import {
  Col, Divider, List, Row,
} from 'antd';
import React, { useEffect } from 'react';
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
  useEffect(() => {
    setTitles({
      title: 'Informacion de libro', subtitle: '',
    });
    // eslint-disable-next-line
  }, [INITIAL_STATE]);
  const data = [
    (book.title),
    (book.price),
    (book.author),
    (book.unitaryCost),
    (book.provider),
  ];
  return (
    <Row justify="space-around" align="middle">
      <Col span={12}>
        <Divider orientation="left">Detalles</Divider>
        <List
          size="large"
          header={<div>-------------------------</div>}
          footer={<div>-------------------------</div>}
          dataSource={data}
          bordered
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
