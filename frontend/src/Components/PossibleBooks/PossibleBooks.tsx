import {
  Avatar, Col, List, Row, Typography,
} from 'antd';
import React from 'react';
import { Catalogue } from 'src/@types';
import { Props } from './PossibleBooks.type';
import styles from './PossibleBooks.module.css';

const ListMetadata: React.FC<{
  items: Omit<Catalogue, 'id'>[], isLoading: boolean,
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
            <Typography.Paragraph type="secondary" ellipsis>
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
        Selecciona uno de los siguientes metadatos:
      </Typography.Title>

      <Typography.Title level={5}>
        Metadatos del catálogo:
      </Typography.Title>
      {internalBook
        && <ListMetadata isLoading={isLoading} items={[internalBook]} />}

      <Typography.Title level={5}>
        Metadatos externos:
      </Typography.Title>
      {externalBooks.length > 0
        ? <ListMetadata isLoading={isLoading} items={externalBooks} />
        : 'No se encontraron metadatos externos. Prueba ingresando los datos manualmente'}
    </Col>
  </Row>
);

export default PossibleBooks;
