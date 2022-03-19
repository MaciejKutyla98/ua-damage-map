import React from 'react';
import cn from 'classnames';
import { ExclamationOutlined } from '@ant-design/icons';

import styles from './MarkerIcon.module.scss';

export const MarkerIcon = ({variant}) => {
  return (
    <div className={cn(styles.marker, {
      [styles.markerBad]: variant === 'bad',
      [styles.markerModerate]: variant === 'moderate',
      [styles.markerGood]: variant === 'good'}
    )}>
      <ExclamationOutlined color={'white'} className={styles.icon} />
    </div>
  )
};