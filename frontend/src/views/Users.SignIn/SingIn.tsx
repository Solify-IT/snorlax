import React, { useState } from 'react';

import {
  Form, Input, Button, Row, Col, notification, Alert,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { wrapError } from 'src/@types';
import useFirebase from 'src/hooks/firebase';
import Firebase from 'src/integrations/firebase/firebase';
import styles from './SignIn.styles.module.css';

const SignIn = () => {
  const firebase = useFirebase();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const onFinish = async (values: { email: string; password: string }) => {
    setIsLoading(true);

    const [fireBResult, fireBError] = await wrapError(
      firebase.doSignInWithEmail(values.email, values.password),
    );

    if (fireBError || !fireBResult || !fireBResult.user) {
      setIsLoading(false);
      notification.error({ message: 'Ocurrió un error.' });
      setFormError(Firebase.getSpanishErrorMessage(
        fireBError
          ? { message: (fireBError as any).message, code: (fireBError as any).code }
          : { message: '', code: '' },
      ));
      return;
    }

    console.log(fireBResult);

    setIsLoading(false);
    notification.success({ message: '¡Inicio de sesión exitoso!' });
  };

  return (
    <Row>
      <Col span={8} offset={8}>
        {formError && (
          <Alert
            message="Error"
            description={formError}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}
        <Form
          name="login"
          size="large"
          className={styles.loginForm}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Por favor ingresa tu correo electrónico' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Correo electrónico" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Contraseña"
            />
          </Form.Item>
          <Form.Item>
            <a className={styles.loginFormForgot} href="https://www.google.com/">
              Recuperar contraseña
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              className={styles.loginFormButton}
            >
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>

  );
};

export default SignIn;
