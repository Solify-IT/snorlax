import {
  Avatar, Col, List, Row, Typography,
} from 'antd';
import React from 'react';
import { Catalogue, ExternalBook } from 'src/@types';
import { Props } from './PossibleBooks.type';
import styles from './PossibleBooks.module.css';

const ListExternalBooks: React.FC<{
  items: ExternalBook[], isLoading: boolean,
}> = ({ items, isLoading }) => (
  <List
    size="large"
    loading={isLoading}
    itemLayout="horizontal"
    dataSource={items}
    renderItem={(item) => (
      <List.Item className={styles.listItem}>
        <List.Item.Meta
          avatar={<Avatar src={item.coverURL} />}
          title={item.title}
          description={item.authors.join(', ')}
        />
      </List.Item>
    )}
  />
);

const ListInternalBooks: React.FC<{
  items: Catalogue[], isLoading: boolean,
}> = ({ items, isLoading }) => (
  <List
    size="large"
    loading={isLoading}
    itemLayout="horizontal"
    dataSource={items}
    renderItem={(item) => (
      <List.Item className={styles.listItem}>
        <List.Item.Meta
          avatar={<Avatar src={item.coverImageUrl} />}
          title={item.title}
          description={(
            <Typography.Paragraph ellipsis>
              {`${item.author} - ${item.synopsis}`}
            </Typography.Paragraph>
          )}
        />
      </List.Item>
    )}
  />
);

const PossibleBooks: React.FC<Props> = ({ externalBooks, isLoading, internalBook }) => (
  <Row
    gutter={{
      xs: 8, sm: 16, md: 24, lg: 32,
    }}
    style={{ padding: '0 28px' }}
  >
    <Col span={24}>
      <Typography.Title level={4}>
        Metadatos del catálogo:
      </Typography.Title>
      {internalBook
        && <ListInternalBooks isLoading={isLoading} items={[internalBook]} />}

      <Typography.Title level={4}>
        Metadatos externos:
      </Typography.Title>
      {externalBooks.length > 0
        ? <ListExternalBooks isLoading={isLoading} items={externalBooks} />
        : 'No se encontraron metadatos externos. Prueba ingresando los datos manualmente'}
    </Col>
  </Row>
);

export default PossibleBooks;
