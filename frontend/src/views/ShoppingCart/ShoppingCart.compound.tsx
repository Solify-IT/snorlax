import { notification } from 'antd';
import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { SIGN_IN } from 'src/Components/Router/routes';
import useAuth from 'src/hooks/auth';
import useNavigation from 'src/hooks/navigation';
import { SHOW_SHOPPING_CART } from 'src/utils/featureToggles';
import ShoppingCartComp from './ShoppingCart';

const ShoppingCart: React.FC = () => {
  const { user, getHomeForRole } = useAuth();
  const { setTitles } = useNavigation();

  useEffect(() => {
    if (!user || !SHOW_SHOPPING_CART) return;

    setTitles({
      title: 'Punto de venta',
      subtitle: 'Añade libros por su ISBN',
    });
  }, []);

  if (!user) {
    notification.error({ message: 'No tienes acceso.' });
    return <Redirect to={SIGN_IN} />;
  }

  if (!SHOW_SHOPPING_CART) {
    return <Redirect to={getHomeForRole(user.role.name)} />;
  }

  return (<ShoppingCartComp user={user} />);
};

export default ShoppingCart;
