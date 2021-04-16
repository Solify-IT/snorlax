import React from 'react';
import {
  Menu, Layout, PageHeader as PageHeaderAntd,
} from 'antd';
import useNavigation from 'src/hooks/navigation';
import './styles.css';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const PageHeader: React.FC = ({ children }) => {
  const { title, subtitle, extra } = useNavigation();
  return (
    <Layout id="components-layout">
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Inventario</Menu.Item>
          <Menu.Item key="2">Punto de venta</Menu.Item>
          <Menu.Item key="3">Administración</Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['books']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu key="books" title="Libros">
              <Menu.Item key="1">Registrar Libros</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px 24px' }}>
          <Content
            id="content"
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <PageHeaderAntd
              ghost={false}
              onBack={() => window.history.back()}
              title={title}
              subTitle={subtitle}
              extra={extra}
              style={{ padding: '0 0 12px' }}
            />
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default PageHeader;
