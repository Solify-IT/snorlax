import React from 'react';

import {
  Form, Input, Button, Row, Col,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './SignIn.styles.module.css';

const SignIn = () => {
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <Row>
      <Col span={8} offset={8}>
        <Form
          name="normal_login"
          className={styles.loginForm}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Por favor ingresa tu usario' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <a className={styles.loginFormForgot} href="https://www.google.com/">
              Recuperar contraseña
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.loginFormButton}>
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>

  );
};

export default SignIn;
