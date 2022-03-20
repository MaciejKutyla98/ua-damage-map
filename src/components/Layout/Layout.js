import React from 'react';

import { Layout as AntLayout } from 'antd';
import styles from './Layout.module.scss';

export const Layout = ({children}) => {
  return (
    <AntLayout>
      <AntLayout.Header className={styles.header}>
        <h1 className={styles.heading}><span className={styles.map}>🇺🇦</span>Damage Map</h1>
      </AntLayout.Header>
      <AntLayout.Content>
        {children}
      </AntLayout.Content>
    </AntLayout>
  )
};

export default Layout;