import React, { useEffect } from 'react';
import useNavigation from 'src/hooks/navigation';
// import { Redirect, useHistory } from 'react-router-dom';
import {
  Form, Input, Button,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
// import { wrapError } from 'src/@types';
// import useAuth from 'src/hooks/auth';
// import useFirebase from 'src/hooks/firebase';
// import useNavigation from 'src/hooks/navigation';
// import { useBackend } from 'src/integrations/backend';
// import Firebase from 'src/integrations/firebase/firebase';
// import styles from './ForgotPassword.styles.module.css';

const ForgotPassword: React.FC = () => {
  const { setTitles } = useNavigation();
  useEffect(() => {
    setTitles({
      title: 'Recover Password',
    });
  }, [setTitles]);

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
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ForgotPassword;
