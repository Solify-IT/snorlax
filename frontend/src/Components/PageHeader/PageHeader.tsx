import React from 'react';
import {
  Layout, PageHeader as PageHeaderAntd,
} from 'antd';
import { useHistory } from 'react-router-dom';
import useNavigation from 'src/hooks/navigation';
import './styles.css';
import NavHeader from '../NavHeader';
import SideMenu from '../SideMenu';

const { Content, Sider } = Layout;

const PageHeader: React.FC = ({ children }) => {
  const { title, subtitle, extra } = useNavigation();
  const history = useHistory();

  const goTo = (path: string) => () => history.push(path);

  return (
    <Layout id="components-layout">
      <NavHeader />
      <Layout>
        <Sider width={200} className="site-layout-background">
          <SideMenu goTo={goTo} />
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
