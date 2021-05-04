import {
  Button, Col, Form, Input, Row, Switch,
} from 'antd';
import React, { useEffect, useState } from 'react';
import PossibleBooks from 'src/Components/PossibleBooks';
import useNavigation from 'src/hooks/navigation';
import Props from './Books.Update.type';

const INITIAL_STATE = {
  isbn: '',
  price: 0,
  amount: 0,
  isloan: false,
};

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};

const UpdateForm: React.FC<Props> = ({ book, onFinish, onFinishFailed }) => {
  const { setTitles } = useNavigation();
  const [selectedISBN] = useState(book.isbn);
  const [form] = Form.useForm();

  useEffect(() => {
    setTitles({
      title: 'Actualizar Libro en Inventario', subtitle: '',
    });
  }, [INITIAL_STATE]);

  return (
    <>
      <Row>
        <Col span={12}>
          <Form
            {...layout}
            form={form}
            name="modifyBook"
            initialValues={book}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  label="ISBN"
                  name="isbn"
                >
                  <Input placeholder="ISBN" disabled value="1" />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  label="Título"
                  name="title"
                >
                  <Input placeholder="Título" disabled value="Título Test" />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                <Form.Item
                  label="Precio"
                  name="price"
                >
                  <Input placeholder="PRECIO" disabled value="100" />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item label="¿Es consigna?" name="isLoan">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                <Form.Item
                  label="Cantidad Previa"
                  name="amount"
                >
                  <Input placeholder="Cantidad" disabled value="Cantidad" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Cantidad Nueva"
                  name="newAmount"
                >
                  <Input placeholder="Cantidad" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item {...tailLayout}>
              <Button
                type="primary"
                htmlType="submit"
              >
                Guardar
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col style={{ position: 'relative' }} span={12}>
          <PossibleBooks isbn={selectedISBN || ''} />
        </Col>
      </Row>
    </>
  );
};
export default UpdateForm;
