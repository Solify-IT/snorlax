import React from 'react';
import {
  Layout, Menu, PageHeader as PageHeaderAntd,
} from 'antd';
import { useHistory } from 'react-router-dom';
import useNavigation from 'src/hooks/navigation';
import './styles.css';
import { LIST_LOCAL_BOOKS,SEARCH_LOCAL_BOOKS, NEW_BOOK } from '../Router/routes';
import NavHeader from '../NavHeader';
import SideMenu from '../SideMenu';
import SubMenu from 'antd/lib/menu/SubMenu';

const { Content, Sider } = Layout;

const PageHeader: React.FC = ({ children }) => {
  const { title, subtitle, extra } = useNavigation();
  const history = useHistory();

  const goTo = (path: string) => () => history.push(path);

  return (
    <Layout id="components-layout">
      <NavHeader goTo={goTo} />
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['books']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu key="books" title="Libros">
              <Menu.Item key="1" onClick={goTo(NEW_BOOK)}>
                Registrar Libros
              </Menu.Item>
              <Menu.Item key="2" onClick={goTo(LIST_LOCAL_BOOKS)}>
                Libros disponibles
              </Menu.Item>
              <Menu.Item key="3" onClick={goTo(SEARCH_LOCAL_BOOKS)}>
                Consulta de libros
              </Menu.Item>
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
