import {
  Button, Col, Form, Input, InputNumber, notification, Row, Spin, Switch,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PossibleBooks from 'src/Components/PossibleBooks';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import { StateType } from './Books.RegisterForm.type';

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

const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};

const RegisterForm: React.FC = () => {
  const { setTitles } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedISBN, setSelectedISBN] = useState(INITIAL_STATE.isbn);
  const backend = useBackend();
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    setTitles({
      title: 'Añadir libros', subtitle: 'Ingresa todos los campos requeridos',
    });
    // eslint-disable-next-line
  }, [INITIAL_STATE]);

  const onFinish = async (values: StateType) => {
    setIsLoading(true);
    const [result, error] = await backend.books.createOne({
      ...values, libraryId: 'e11e5635-094c-4224-836f-b0caa13986f3',
    });

    if (error) {
      notification.error({
        message: '¡Ocurrió un error al guardar!',
        description: 'Intentalo después.',
      });
    } else {
      notification.success({
        message: '¡Libro guardado!',
        description: 'Puedes añadir más libros o ir al detalle del libro agregado.',
        btn: (
          <Button
            type="primary"
            onClick={() => history.push(`/books/${result!.data.id}`)}
          >
            Ir al detalle
          </Button>
        ),
      });
      form.resetFields();
    }

    setIsLoading(false);
  };

  const onFinishFailed = () => {
    notification.error({
      message: '¡Ocurrió un error al guardar!',
      description: 'Intentalo después.',
    });
  };

  const onISBNChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedISBN(event.target.value);
  };

  return (
    <Row>
      <Col span={12}>
        <Form
          {...layout}
          form={form}
          name="registerBook"
          initialValues={INITIAL_STATE}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          size="large"
        >
          <Form.Item
            label="ISBN"
            name="isbn"
            rules={[{
              required: true,
              message: 'Debes ingresar un ISBN válido',
              len: 13,
            }]}
          >
            <Input onChange={onISBNChange} />
          </Form.Item>

          <Form.Item
            label="Precio"
            name="price"
            rules={[{
              required: true,
              message: 'Debes ingresar un precio válido',
            }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Cantidad"
            name="amount"
            rules={[{
              required: true,
              message: 'Debes ingresar una cantidad válida',
            }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item label="¿Es consigna?" name="isLoan">
            <Switch />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button
              loading={isLoading}
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
  );
};

export default RegisterForm;
