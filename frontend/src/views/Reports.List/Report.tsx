/* eslint-disable max-len */
import {
  Button,
  Col, DatePicker, Form, notification, Select, Space, Table,
} from 'antd';
import React, { useState } from 'react';
import { Movement } from 'src/@types';
import moment, { Moment } from 'moment';
import { useBackend } from 'src/integrations/backend';

const { RangePicker } = DatePicker;

interface Props {
  movements: Movement[];
  loading: boolean;
  onFetchMovements: (range: [Moment, Moment], type: string) => void;
}

const columns = [
  {
    title: 'Fecha',
    dataIndex: 'fecha',
    key: 'fecha',
  },
  {
    title: 'Tipo',
    dataIndex: 'typ',
    key: 'typ',
    filters: [
      {
        text: 'Devolucion cliente',
        value: 'Devolucion cliente',
      },
      {
        text: 'Compra',
        value: 'Compra',
      },
      {
        text: 'Venta',
        value: 'Venta',
      },
      {
        text: 'Devolucion Editorial',
        value: 'Devolucion Editorial',
      },
      {
        text: 'Actualizar',
        value: 'Actualizar',
      },
    ],
    onFilter: (value: any, record: any) => record.typ === value,
  },
  {
    title: 'Registros',
    dataIndex: 'totalCount',
    key: 'totalCount',
  },
  {
    title: 'Cantidad',
    dataIndex: 'units',
    key: 'units',
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
  },
];

const ListView: React.FC<Props> = ({ movements, loading, onFetchMovements }) => {
  const backend = useBackend();
  const { Option } = Select;
  const [isFormLoading] = useState(false);
  const [dateRanges, setDateRanges] = useState<[Moment, Moment]>([moment(), moment()]);
  const [form] = Form.useForm();
  const [type, setType] = useState<string>('Venta');

  function onFinish() {
    onFetchMovements(dateRanges, type);
  }

  function onFinishFailed() {
    notification.error({
      message: '¡Ocurrió un error al guardar!',
      description: 'Intentalo después.',
    });
  }

  function onChangeDates(dates: any) {
    setDateRanges(dates);
  }

  return (
    <>
      <div style={{
        padding: '30px',
        background: '#ececec',
      }}
      >
        <Form
          form={form}
          name="registerLibrary"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          size="large"
          scrollToFirstError
        >
          <Col span={8}>
            <Space direction="vertical" size={12}>
              <RangePicker
                value={dateRanges}
                name="fecha"
                onChange={onChangeDates}
              />
            </Space>
          </Col>
          <Col>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Seleccionar opcion"
              optionFilterProp="children"
              value={type}
              onChange={setType}
            >
              <Option value="Devolucion cliente">Devolucion cliente</Option>
              <Option value="Devolucion Editorial">Devolucion Editorial</Option>
              <Option value="Venta">Venta</Option>
              <Option value="Compra">Compra</Option>
              <Option value="Actualizar">Actualizar</Option>
            </Select>
          </Col>
          <Form.Item>
            <Button
              loading={isFormLoading}
              type="primary"
              htmlType="submit"
            >
              Registrar Libreria
            </Button>
          </Form.Item>
        </Form>
        <Button
          href={`${backend.rootEndpoint}/reports/csv?fechaInitial=${dateRanges[0].unix() * 1000}&fechaEnd=${dateRanges[1].unix() * 1000}&type=${type}&token=${backend.config?.headers?.Authorization}`}
          type="link"
          target="_blank"
        >
          Download CSV
        </Button>
      </div>
      <Table
        dataSource={movements}
        loading={loading}
        columns={columns}
      />
    </>
  );
};

export default ListView;
