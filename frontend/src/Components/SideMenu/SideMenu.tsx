import { Menu } from 'antd';
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  ADMIN, INVENTORY, LIBRARIES, LIST_LOCAL_BOOKS, NEW_BOOK, sideMenuItems, sideMenuItemsOpen,
} from '../Router/routes';

const SideMenu: React.FC<{ goTo(path: string): () => void }> = ({ goTo }) => {
  const { pathname } = useLocation();

  return (
    <Menu
      mode="inline"
      style={{ height: '100%', borderRight: 0 }}
    >
      {pathname.includes(INVENTORY) && (
        <Menu.SubMenu key={sideMenuItemsOpen.inventory.books} title="Libros">
          <Menu.Item
            key={sideMenuItems.inventory.books.newBook}
            onClick={goTo(NEW_BOOK)}
          >
            Registrar Libros
          </Menu.Item>
          <Menu.Item
            key={sideMenuItems.inventory.books.list}
            onClick={goTo(LIST_LOCAL_BOOKS)}
          >
            Buscar Libros
          </Menu.Item>
        </Menu.SubMenu>
      )}
      {pathname.includes(ADMIN) && (
        <Menu.SubMenu key={sideMenuItemsOpen.admin.libraries} title="Librerías">
          <Menu.Item
            key={sideMenuItems.inventory.books.list}
            onClick={goTo(LIBRARIES)}
          >
            Lista de Librerías
          </Menu.Item>
        </Menu.SubMenu>
      )}
    </Menu>
  );
};

export default SideMenu;
