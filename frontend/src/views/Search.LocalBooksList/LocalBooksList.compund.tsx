import { Button, Col, Form, Input, InputNumber, Layout, notification, Row, Switch } from 'antd';
import { val } from 'factory.ts';
import React, { useCallback, useEffect, useState } from 'react';
import { Book } from 'src/@types';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import { StateType } from '../Books.RegisterForm/Books.RegisterForm.type';
import LocalBooksListComp from './LocalBooksList';
import { SearchType } from './LocalBooksList.type';


const INITIAL_STATE = {
  isbn: ''
};

const LocalBooksList: React.FC = () => {
  const backend = useBackend();
  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });
  const [isLoading, setIsLoading] = useState(false);
  const { setTitles } = useNavigation();
  const LIBRARY_ID = 'e11e5635-094c-4224-836f-b0caa13986f3';
  const [form] = Form.useForm();
  const [isGlobal, setIsGlobal] = useState(false);

  const fetchBooks = useCallback(async (isbn?: string) => {
    setIsLoading(true);
    
    const [result, error] = await backend.books.getAll<{
      total: number,
      books: Book[],
    }>(`${isGlobal?  '' : `libraryId=${LIBRARY_ID}&` }${isbn?  `isbn=${isbn}&` : '' }page=${pagination.page}&perPage=${pagination.perPage}`);

    if (error || !result) {
      notification.error({ message: 'Ocurrió un error al obtener la lista de libros' });
      return;
    }

    setBooks(result.data.books);
    setTotalBooks(result.data.total);
    setIsLoading(false);
  }, [backend.books, pagination]);

  useEffect(() => {
    fetchBooks();
    setTitles({ title: 'Consultar disponibilidad' });
  }, [fetchBooks, setTitles,isGlobal]);


  const onSearch = async (values: SearchType) => {
 
      setIsLoading(true);
      console.log(values.isGlobal);
      console.log(values.isbn);
      const [result, error] = await backend.books.getAll<{
        total: number,
        books: Book[],
      }>(`${isGlobal?  '' : `libraryId=${LIBRARY_ID}&` }isbn=${values.isbn}&page=${pagination.page}&perPage=${pagination.perPage}`);
      
      if (error || !result) {
        notification.error({ message: 'Ocurrió un error al obtener la lista de libros' });
        return;
      }

      setBooks(result.data.books);
      setTotalBooks(result.data.total);

      setIsLoading(false);

    }

  const onSearchFailed = () => {
    notification.error({
      message: '¡Ocurrió un error al consultar!',
      description: 'Intentalo después.',
    });
  };

  return (
    <div>
     
      <Form
          name="searchByIsbn"
          size="large"
          form={form}
          initialValues={INITIAL_STATE}
          onFinish={onSearch}
          onFinishFailed={onSearchFailed}
        >
          <Layout
          background-color= "white"
          >
          <Form.Item
            label="ISBN"
            name="isbn"
            rules={[{
              required: true,
              message: 'Debes ingresar un ISBN válido',
            }]}
          >
            <Input  />
          </Form.Item>
          <br></br>
          <Form.Item

          name="isGlobal"
          label=" Local"
          valuePropName="checked"
          initialValue={false}
          >
            <Switch
            checkedChildren="Busqueda Global"
            unCheckedChildren="Busqueda Local"
            onChange = {(checked)=>setIsGlobal(checked)}
            /> : Global   
          </Form.Item>
          

          <Form.Item 
          >
            
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
            >
              Buscar Libro
            </Button>
          </Form.Item>

       </Layout>
        </Form>
       
    <LocalBooksListComp
      isLoading={isLoading}
      books={books}
      total={totalBooks}
      setPagination={setPagination}
      pagination={pagination}
    />
    </div> 
    
  );
};

export default LocalBooksList;
