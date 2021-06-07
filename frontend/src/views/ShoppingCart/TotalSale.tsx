import React from 'react';
import {
  AggregatedSale,
} from 'src/@types/movement';
import Row from 'antd/lib/row';
import 'antd/dist/antd.css';
import { Col, Card } from 'antd';

interface Props {
  sales: Array<AggregatedSale>;
}

const TotalSale: React.FC<Props> = ({
  sales,
}) => {
  const now = new Date(Date.now());
  const year = now.getUTCFullYear();
  const month = (now.getMonth() + 1) < 10 ? `0${(now.getMonth() + 1).toString()}` : (now.getMonth() + 1).toString();
  const day = now.getUTCDate() < 10 ? `0${now.getUTCDate()}` : now.getUTCDate().toString();
  const fallbackDate = `${year}-${month}-${day}`;
  return (
    <div style={{
      padding: '30px',
      background: '#ececec',
    }}
    >
      <Row gutter={16}>

        <Col span={8}>
          <Card title="Fecha" bordered={false}>
            {sales[0] ? sales[0].fecha : fallbackDate}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Importe Total" bordered={false}>
            $
            {sales[0] ? sales[0].total : 0}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Cantidad de libros" bordered={false}>
            {sales[0] ? sales[0].totalCount : 0}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TotalSale;
