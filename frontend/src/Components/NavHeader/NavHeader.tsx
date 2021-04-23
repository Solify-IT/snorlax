import { Layout, Menu } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  INVENTORY, SALES_POINT, ADMIN, menuItemKeys,
} from '../Router/routes';

const { Header } = Layout;

const NavHeader: React.FC = () => {
  const { pathname } = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const itemKeys = useMemo(() => menuItemKeys, []);

  useEffect(() => {
    const newSelectedKeys: string[] = [];
    if (pathname.includes(INVENTORY)) newSelectedKeys.push(`header-${itemKeys.intentory}`);
    if (pathname.includes(SALES_POINT)) newSelectedKeys.push(`header-${itemKeys.salesPoint}`);
    if (pathname.includes(ADMIN)) newSelectedKeys.push(`header-${itemKeys.admin}`);

    setSelectedKeys(newSelectedKeys);
  }, [pathname]);

  return (
    <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" selectedKeys={selectedKeys}>
        <Menu.Item key={`header-${itemKeys.intentory}`}>Inventario</Menu.Item>
        <Menu.Item key={`header-${itemKeys.salesPoint}`}>Punto de venta</Menu.Item>
        <Menu.Item key={`header-${itemKeys.admin}`}>Administración</Menu.Item>
      </Menu>
    </Header>
  );
};

export default NavHeader;
