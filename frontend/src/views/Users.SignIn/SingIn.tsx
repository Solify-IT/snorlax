import React, { useEffect, useState } from 'react';
import {
  Link,
  Redirect,
  useHistory,
} from 'react-router-dom';
import {
  Form, Input, Button, Row, Col, notification, Alert, Image,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { wrapError } from 'src/@types';
import useAuth from 'src/hooks/auth';
import useFirebase from 'src/hooks/firebase';
import useNavigation from 'src/hooks/navigation';
import { useBackend } from 'src/integrations/backend';
import Firebase from 'src/integrations/firebase/firebase';
import { FORGOT_PASSWORD } from 'src/Components/Router/routes';
import Logo from 'src/images/ReliBooksLogoBlu.png';
import styles from './SignIn.styles.module.css';

export const ADMIN_ROLE_NAME = 'Admin';
export const CAJERO_ROLE_NAME = 'Cajero';
export const LIBRERO_ROLE_NAME = 'Librero';
export const ALMACENISTA_ROLE_NAME = 'Almacenista';

const SignIn = () => {
  const firebase = useFirebase();
  const { setAuthToken, getHomeForRole, user } = useAuth();
  const backend = useBackend();
  const { setTitles } = useNavigation();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const onFinish = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    let [fireBResult, fireBError] = await wrapError(
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

    const [beResult, beError] = await backend.users.post<{ token: string }, unknown>(
      '/sign-in', { idToken: fireBResult.token },
    );

    if (beError || !beResult || !beResult.data.token) {
      setIsLoading(false);
      notification.error({ message: 'Ocurrió un error.' });
      return;
    }

    [fireBResult, fireBError] = await wrapError(
      firebase.diSignInWithToken(beResult?.data.token || ''),
    );

    if (fireBError || !fireBResult || !fireBResult.user || !fireBResult.token) {
      setIsLoading(false);
      notification.error({ message: 'Ocurrió un error.' });
      setFormError(Firebase.getSpanishErrorMessage(
        fireBError
          ? { message: (fireBError as any).message, code: (fireBError as any).code }
          : { message: '', code: '' },
      ));
      return;
    }

    const userData = setAuthToken(fireBResult.token);

    if (!userData) {
      setIsLoading(false);
      notification.error({ message: 'Ocurrió un error.' });
      return;
    }
    setIsLoading(false);
    history.push(getHomeForRole(userData.role.name));
    notification.success({ message: '¡Inicio de sesión exitoso!' });
  };

  useEffect(() => {
    setTitles({ title: '¡Bienvenido!', subtitle: 'Inicia sesión con tu correo y contraseña' });
  }, []);

  // TODO: Only redirect if user has permission to go to state.from
  // if (user && state && state.from) {
  //   console.log('Third in sign in');
  //   return <Redirect to={state.from} />;
  // }

  if (user) {
    return <Redirect to={getHomeForRole(user.role.name)} />;
  }

  return (
    <Row>
      <Col
        offset={8}
        span={8}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '48px',
          marginBottom: '48px',
        }}
      >
        <Image preview={false} src={Logo} />
      </Col>
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
            <Link className={styles.loginFormForgot} to={(FORGOT_PASSWORD)}>
              Recuperar contraseña
            </Link>
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
