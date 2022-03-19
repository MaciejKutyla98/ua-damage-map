import React from 'react';
import cn from 'classnames';

import { useIsMobile } from '../../hooks/useIsMobile';
import DamageDetails from '../DamageDetails/DamageDetails';

import styles from './DamageDetailsDrawer.module.scss';

import { Drawer } from 'antd';

export const DamageDetailsDrawer = ({damageDetails, visible, onClose}) => {
  const isMobile = useIsMobile();

  console.log('is', isMobile);

  return (
    <Drawer className={cn(styles.drawer, {[styles.drawerDesktop]: !isMobile})} placement={isMobile ? 'bottom' : 'left'} visible={visible} onClose={onClose}>
      <DamageDetails damageDetails={damageDetails} />
    </Drawer>
  )
};
