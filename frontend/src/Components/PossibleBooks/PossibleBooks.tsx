import { Col, Row } from 'antd';
import React from 'react';
import BookCard from '../BookCard';
import { Props } from './PossibleBooks.type';

const PossibleBooks: React.FC<Props> = ({ books }) => (
  <Row
    gutter={{
      xs: 8, sm: 16, md: 24, lg: 32,
    }}
    style={{ padding: '0 24px' }}
  >
    {books.length > 0
      ? <Col span={14} offset={5}><BookCard book={books[0]} /></Col>
      : 'No se encontraron metadatos'}
  </Row>
);

export default PossibleBooks;
