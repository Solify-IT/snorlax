import {
  Col, Form, Row,
} from 'antd';
import React, { useEffect } from 'react';
import BookForm from 'src/Components/Book.Form';
import useNavigation from 'src/hooks/navigation';
import Props from './Books.Update.type';

const INITIAL_STATE = {
  isbn: '',
  price: 0,
  amount: 0,
  isloan: false,
};

const UpdateForm: React.FC<Props> = ({
  book, onFinish, onFinishFailed, isLoading,
}) => {
  const { setTitles } = useNavigation();
  const [form] = Form.useForm();

  useEffect(() => {
    setTitles({
      title: 'Actualizar Libro en Inventario', subtitle: '',
    });
  }, [INITIAL_STATE]);

  // return (
  //   <Row justify="space-around" align="middle">
  //     <Col span={12}>
  //       <Form
  //         form={form}
  //         name="modifyBook"
  //         initialValues={book}
  //         onFinish={onFinish}
  //         onFinishFailed={onFinishFailed}
  //       >

  //         <Col>
  //           <Form.Item
  //             label="ISBN"
  //             name="isbn"
  //           >
  //             <Input placeholder="ISBN" disabled value="isbn1" />
  //           </Form.Item>
  //         </Col>

  //         <Col span={12}>
  //           <Form.Item
  //             label="Título"
  //             name="title"
  //           >
  //             <Input placeholder="Título" disabled value="Título Test" />
  //           </Form.Item>
  //         </Col>

  //         <Col span={6}>
  //           <Form.Item
  //             label="Precio"
  //             name="price"
  //           >
  //             <Input placeholder="PRECIO" disabled value="100" />
  //           </Form.Item>
  //         </Col>

  //         <Col span={12}>
  //           <Form.Item label="¿Es consigna?" name="isLoan">
  //             <Switch />
  //           </Form.Item>
  //         </Col>

  //         <Col span={8}>
  //           <Form.Item
  //             label="Cantidad Previa"
  //             name="amount"
  //           >
  //             <Input placeholder="Cantidad" disabled value="Cantidad" />
  //           </Form.Item>
  //         </Col>

  //         <Col span={8}>
  //           <Form.Item
  //             label="Cantidad Nueva"
  //             name="newAmount"
  //           >
  //             <Input placeholder="Cantidad" />
  //           </Form.Item>
  //         </Col>

  //         <Form.Item {...tailLayout}>
  //           <Button
  //             type="primary"
  //             htmlType="submit"
  //           >
  //             Guardar
  //           </Button>
  //         </Form.Item>
  //       </Form>
  //     </Col>
  //   </Row>
  // );
  return (
    <Row>
      <Col offset={6} span={12}>
        <BookForm
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}
          initialState={book}
          isLoading={isLoading}
          isManualInsert
          isUpdate
        />
      </Col>
    </Row>
  );
};
export default UpdateForm;
