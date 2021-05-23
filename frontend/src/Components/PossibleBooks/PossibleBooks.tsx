import {
  Avatar, Col, List, Row, Typography,
} from 'antd';
import React from 'react';
import { Catalogue } from 'src/@types';
import { Props } from './PossibleBooks.type';
import styles from './PossibleBooks.module.css';

const ListMetadata: React.FC<{
  items: Omit<Catalogue, 'id'>[],
  isLoading: boolean,
  type: 'catalogue' | 'external',
  setSelected: Props['setSelected'],
}> = ({
  items, isLoading, type, setSelected,
}) => (
  <List
    size="large"
    loading={isLoading}
    itemLayout="horizontal"
    dataSource={items}
    renderItem={(item) => (
      <List.Item
        className={styles.listItem}
        onClick={() => setSelected({ selected: item, type })}
      >
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

const PossibleBooks: React.FC<Props> = ({
  externalBooks, isLoading, internalBook, setSelected,
}) => (
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

      {internalBook
        ? (
          <>
            <Typography.Title level={5}>
              Metadatos del catálogo:
            </Typography.Title>
            <ListMetadata setSelected={setSelected} type="catalogue" isLoading={isLoading} items={[internalBook]} />
          </>
        )
        : externalBooks.length > 0 && (
          <Typography.Text>
            No hay metadatos en el catálogo, selecciona uno de los libros de abajo
            o ingresa manualmente los datos.
          </Typography.Text>
        )}

      {externalBooks.length > 0
        ? (
          <>
            <Typography.Title level={5}>
              Metadatos externos:
            </Typography.Title>
            <ListMetadata setSelected={setSelected} type="external" isLoading={isLoading} items={externalBooks} />
          </>
        )
        : (
          <Typography.Text>
            No hay metadatos externos, debes ingresar manualmente los datos para este ISBN.
          </Typography.Text>
        )}
    </Col>
  </Row>
);

export default PossibleBooks;
