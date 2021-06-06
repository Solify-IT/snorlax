import React, { useEffect, useState } from 'react';
import { useBackend } from 'src/integrations/backend';
import {
  AggregatedSale
} from 'src/@types/movement';
import Row from 'antd/lib/row';
import 'antd/dist/antd.css';
import { Col, Card } from 'antd';

interface Props {
  sales: Array<AggregatedSale>;
}

const TotalSale: React.FC<Props> = ({
  sales
}) => {
  return (
    sales.length > 0 ? <div style={{
      padding: '30px',
      background: '#ececec',
    }}>
      <Row gutter={16}>
      <Col span={8}>
        <Card title="Fecha" bordered={false}>
          {sales[0].fecha}
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Importe Total" bordered={false}>
        ${sales[0].total}
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Cantidad de libros" bordered={false}>
        {sales[0].totalCount}
        </Card>
      </Col>
    </Row>
    </div> : null
  );
};

export default TotalSale;
