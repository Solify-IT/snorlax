import {
  Button, Col, Form, notification, Row,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { BookFormType, Catalogue, ExternalBook } from 'src/@types';
import BookForm from 'src/Components/Book.Form';
import PossibleBooks from 'src/Components/PossibleBooks';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';

const INITIAL_STATE = {
  isbn: '',
  price: 0,
  amount: 1,
  isLoan: false,
  title: '',
  unitaryCost: 0,
  author: '',
  editoral: '',
  area: '',
  theme: '',
  subTheme: '',
  collection: '',
  provider: '',
  type: '',
  coverType: '',
  coverImageUrl: '',
  subCategory: '',
  distribuitor: '',
  synopsis: '',
  pages: 0,
};

const RegisterForm: React.FC = () => {
  const { setTitles } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<{
    selected: Catalogue | ExternalBook | undefined,
    type: 'catalogue' | 'external' | undefined,
  }>({ selected: undefined, type: undefined });
  const [selectedISBN, setSelectedISBN] = useState(INITIAL_STATE.isbn);
  const backend = useBackend();
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    setTitles({
      title: 'Añadir libros', subtitle: 'Ingresa todos los campos requeridos',
    });
    // eslint-disable-next-line
  }, [INITIAL_STATE, selected]);

  const onFinish = async (values: BookFormType) => {
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
        <BookForm
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onISBNChange={onISBNChange}
          form={form}
          initialState={
            selected.selected
              ? { ...selected.selected, price: INITIAL_STATE.price, amount: INITIAL_STATE.amount }
              : INITIAL_STATE
          }
          isLoading={isLoading}
          isManualInsert={selected.type === 'external' || !selected.selected}
        />
      </Col>
      <Col style={{ position: 'relative' }} span={12}>
        <PossibleBooks setSelected={setSelected} isbn={selectedISBN || ''} />
      </Col>
    </Row>
  );
};

export default RegisterForm;
