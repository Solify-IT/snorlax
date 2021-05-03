import {
  Col, Form, Input, Row,
} from 'antd';
import React, { useEffect, useState } from 'react';
import PossibleBooks from 'src/Components/PossibleBooks';
import useNavigation from 'src/hooks/navigation';
import Props from './FormViewBook.type';

const INITIAL_STATE = {
  isbn: '',
  price: 0,
  amount: 1,
  isLoan: false,
};

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const FormViewBook: React.FC<Props> = ({ book }) => {
  console.log(book.id);

  const { setTitles } = useNavigation();
  const [selectedISBN] = useState(book.isbn);
  const [form] = Form.useForm();

  useEffect(() => {
    setTitles({
      title: 'Informacion de libro', subtitle: '',
    });
    // eslint-disable-next-line
  }, [INITIAL_STATE]);

  return (
    <Row>
      <Col span={12}>
        <Form
          {...layout}
          form={form}
          name="SeeBook"
          initialValues={book}
          size="large"
        >
          <Form.Item
            label="Titulo"
            name="title"
          >
            <Input name="title" readOnly style={{ width: '120%', textAlign: 'center' }} />
          </Form.Item>
          <Form.Item
            label="ISBN"
            name="isbn"
          >
            <Input name="isbn" readOnly style={{ width: '120%', textAlign: 'center' }} />
          </Form.Item>

          <Form.Item
            label="Precio"
            name="price"
          >
            <Input name="price" readOnly style={{ width: '120%', textAlign: 'center' }} />
          </Form.Item>

        </Form>
      </Col>
      <Col style={{ position: 'relative' }} span={12}>
        <PossibleBooks isbn={selectedISBN || ''} />
      </Col>
    </Row>
  );
};

export default FormViewBook;
