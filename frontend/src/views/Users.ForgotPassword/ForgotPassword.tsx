import React, { useEffect } from 'react';
import useNavigation from 'src/hooks/navigation';
import {
  Form, Input, Button, Col, Row, notification,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import useFirebase from 'src/hooks/firebase';
import styles from './ForgotPassword.styles.module.css';

const ForgotPassword: React.FC = () => {
  const { setTitles } = useNavigation();
  const firebase = useFirebase();
  useEffect(() => {
    setTitles({
      title: 'Recover Password',
    });
  }, [setTitles]);

  async function handleForgetPassword(email: string): Promise<void> {
    await firebase.passwordReset(email);
  }

  const onFinish = (values: any) => {
    handleForgetPassword(values.email);
    notification.success({
      message: 'Correo enviado',
      description: 'Revisa tu correo, puede tardar unos minutos o en tu carpeta de spam',
    });
  };

  return (
    <Row>
      <Col span={8} offset={8}>
        <Form
          name="normal_login"
          className={styles.resetForm}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Por favor ingrese su correo' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Correo" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.forgotFormButton}>
              Enviar Correo
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
