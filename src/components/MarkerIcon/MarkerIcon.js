import React from 'react';
import cn from 'classnames';
import { ExclamationOutlined, CheckOutlined } from '@ant-design/icons';

import styles from './MarkerIcon.module.scss';

export const MarkerIcon = ({variant, onClick, pointCount, isAvailablePoint}) => {
  const Icon = isAvailablePoint ? CheckOutlined : ExclamationOutlined;

  return (
    <div className={cn(styles.marker, {
      [styles.markerBad]: variant === 'bad',
      [styles.markerModerate]: variant === 'moderate',
      [styles.markerGood]: variant === 'good',
      [styles.markerWithPointCount]: !!pointCount,
      [styles.markerAvailablePoint]: isAvailablePoint,
    }
    )} onClick={onClick}>
      {pointCount ? <span className={styles.pointCount}>{pointCount}</span> : <Icon color={'white'} className={styles.icon} />}
    </div>
  )
};