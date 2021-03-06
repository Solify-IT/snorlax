import { Spin } from 'antd';
import React from 'react';
import styles from './styles.module.css';

const Loader: React.FC<{ isLoading: boolean }> = ({ isLoading }) => (
  <>
    {isLoading && (
      <div data-testid="loader" className={styles.loader}>
        <Spin size="large" />
      </div>
    )}
  </>
);

export default Loader;
