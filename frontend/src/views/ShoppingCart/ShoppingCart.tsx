// import Search from 'antd/lib/input/Search';
import React from 'react';
import { AuthUserType } from 'src/hooks/auth';

interface Props {
  user: AuthUserType;
}

const ShoppingCart: React.FC<Props> = ({ user }) => (
  <>
    Carrito de compras del usuario con email
    {` ${user.email}`}
    de la librería
    {` ${user.library.name}`}
  </>
);

export default ShoppingCart;
