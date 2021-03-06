import { Card } from 'antd';
import React from 'react';
import Props from './BookCard.type';

const BookCard = ({ book }: Props) => (
  <Card
    style={{ width: '100%' }}
    cover={<img alt={`cover-${book.isbn}`} src={book.coverImageUrl} />}
    data-testid="card-container"
  >
    <Card.Meta
      title={book.title}
      description={`Authores: ${book.author}`}
      data-testid="card-meta"
    />
  </Card>
);

export default BookCard;
