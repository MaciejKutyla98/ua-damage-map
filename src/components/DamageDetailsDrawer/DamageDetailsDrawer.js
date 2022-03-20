import React from 'react';
import cn from 'classnames';

import { useIsMobile } from '../../hooks/useIsMobile';
import DamageDetails from '../DamageDetails/DamageDetails';

import styles from './DamageDetailsDrawer.module.scss';

import { Drawer } from 'antd';

export const DamageDetailsDrawer = ({damageDetails, visible, onClose, bounds, onSetAvailablePoints}) => {
  const isMobile = useIsMobile();

  return (
    <Drawer
      title={damageDetails?.placeName}
      className={cn(styles.drawer, {[styles.drawerDesktop]: !isMobile})}
      placement={isMobile ? 'bottom' : 'left'}
      visible={visible}
      onClose={onClose}
    >
      {damageDetails && (
        <DamageDetails
          damageDetails={damageDetails}
          bounds={bounds}
          onSetAvailablePoints={onSetAvailablePoints}
        />
      )}
    </Drawer>
  )
};
