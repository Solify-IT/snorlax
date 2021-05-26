import { notification } from 'antd';
import React, { useEffect } from 'react';
import useAuth from 'src/hooks/auth';
import useNavigation from 'src/hooks/navigation';

const ShoppingCart: React.FC = () => {
  const { user } = useAuth();
  const { setTitles } = useNavigation();

  if (!user) {
    notification.error({ message: 'No tienes acceso.' });
    return null;
  }

  useEffect(() => {
    setTitles({
      title: 'Punto de venta',
      subtitle: 'Añade libros por su ISBN',
    });
  }, []);

  return (
    <>Hola</>
  );
};

export default ShoppingCart;
