import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import {
  Form, Input, Button, Row, Col, notification, Alert, Checkbox,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { wrapError } from 'src/@types';
import useAuth from 'src/hooks/auth';
import useFirebase from 'src/hooks/firebase';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import Firebase from 'src/integrations/firebase/firebase';
import styles from './ForgotPassword.styles.module.css';

const ForgotPassword = () => {
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

      </Form.Item>

    </Form>
  );
};

export default ForgotPassword;
