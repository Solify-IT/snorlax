import { Menu } from 'antd';
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  ADMIN, INVENTORY, sideMenuItems, sideMenuItemsOpen,
} from '../Router/routes';

const SideMenu: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <Menu
      mode="inline"
      style={{ height: '100%', borderRight: 0 }}
    >
      {pathname.includes(INVENTORY) && (
        <Menu.SubMenu key={sideMenuItemsOpen.inventory.books} title="Libros">
          <Menu.Item key={sideMenuItems.inventory.books.newBook}>Registrar Libros</Menu.Item>
        </Menu.SubMenu>
      )}
      {pathname.includes(ADMIN) && (
        <Menu.SubMenu key={sideMenuItemsOpen.admin.libraries} title="Librerías">
          <Menu.Item key="1">Lista de Librerías</Menu.Item>
        </Menu.SubMenu>
      )}
    </Menu>
  );
};

export default SideMenu;
