import { Spin } from 'antd';
import React from 'react';
import './styles.module.css';

const Loader: React.FC<{ isLoading: boolean }> = ({ isLoading }) => (
  <>
    {isLoading && (
      <div className="loader">
        <Spin size="large" />
      </div>
    )}
  </>
);

export default Loader;
