import { Menu } from 'antd';
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  ADMIN,
  INVENTORY,
  LIBRARIES,
  LIST_LOCAL_BOOKS,
  LIST_USERS,
  MOVEMENTS,
  RETURNS,
  SALES_POINT,
} from '../Router/routes';

const SideMenu: React.FC<{ goTo(path: string): () => void }> = ({ goTo }) => {
  const { pathname } = useLocation();
  console.log('pathname', pathname);

  return (
    <Menu
      mode="inline"
      style={{ height: '100%', borderRight: 0 }}
    >
      {pathname.includes(INVENTORY) && (
        <Menu.SubMenu key="books" title="Libros">
          <Menu.Item
            key="books:list"
            onClick={goTo(LIST_LOCAL_BOOKS)}
          >
            Buscar Libros
          </Menu.Item>
        </Menu.SubMenu>
      )}
      {pathname.includes(SALES_POINT) && (
        <Menu.SubMenu key="actions" title="Acciones">
          <Menu.Item
            key="actions:devolutions"
            onClick={goTo(RETURNS)}
          >
            Devoluciones
          </Menu.Item>
          <Menu.Item
            key="actions:movements"
            onClick={goTo(MOVEMENTS)}
          >
            Movimientos
          </Menu.Item>
        </Menu.SubMenu>
      )}
      {pathname.includes(ADMIN) && (
        <>
          <Menu.SubMenu key="users" title="Usuarios">
            <Menu.Item key="users:list" onClick={goTo(LIST_USERS)}>
              Lista de usuarios
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="libraries" title="Librerías">
            <Menu.Item
              key="libraries:list"
              onClick={goTo(LIBRARIES)}
            >
              Lista de Librerías
            </Menu.Item>
          </Menu.SubMenu>
        </>
      )}
    </Menu>
  );
};

export default SideMenu;
