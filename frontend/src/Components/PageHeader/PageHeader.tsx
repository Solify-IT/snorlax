import React from 'react';
import {
  Layout, PageHeader as PageHeaderAntd,
} from 'antd';
import { useHistory } from 'react-router-dom';
import useAuth from 'src/hooks/auth';
import useNavigation from 'src/hooks/navigation';
import './styles.css';
import NavHeader from '../NavHeader';
import SideMenu from '../SideMenu';

const { Content, Sider } = Layout;

const LayoutContent: React.FC<{
  title: string,
  subtitle: string,
  extra?: React.ReactNode,
  styles?: object,
}> = ({
  children, title, subtitle, extra, styles,
}) => (
  <Layout style={{ padding: '24px 24px', ...styles }}>
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
);

const PageHeader: React.FC = ({ children }) => {
  const { title, subtitle, extra } = useNavigation();
  const history = useHistory();
  const { user } = useAuth();

  const goTo = (path: string) => () => history.push(path);

  if (!user) {
    return (
      <LayoutContent
        subtitle={subtitle}
        title={title}
        extra={extra}
        styles={{ height: '100vh' }}
      >
        {children}
      </LayoutContent>
    );
  }

  return (
    <Layout id="components-layout">
      <NavHeader goTo={goTo} />
      <Layout>
        <Sider width={200} className="site-layout-background">
          <SideMenu goTo={goTo} />
        </Sider>
        <LayoutContent subtitle={subtitle} title={title} extra={extra}>
          {children}
        </LayoutContent>
      </Layout>
    </Layout>
  );
};

export default PageHeader;
