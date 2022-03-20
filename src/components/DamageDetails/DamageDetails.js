import React from 'react';
import cn from 'classnames';
import { Statistic, Row, Col, Button } from 'antd';
import styles from './DamageDetails.module.scss';

export const DamageDetails = ({damageDetails}) => {
    const text = {
        worksCorrectly: 'It does not work!',
        worksPartially: 'It works partially!',
        doesNotWork: 'It works correctly!'
    }[damageDetails.damageDegree];

  console.log('debug', damageDetails);
  return (
    <div className={styles.wrapper}>
      <div className={styles.damageDegree}>
        <p className={styles.heading}>
          Damage degree:
        </p>
        <p className={cn(
            styles.content,
            {
                [styles.contentGood]: damageDetails.damageDegree === 'doesNotWork',
                [styles.contentModerate]: damageDetails.damageDegree === 'worksPartially',
                [styles.contentBad]: damageDetails.damageDegree === 'worksCorrectly'
            }
        )}>
            {text}
        </p>
      </div>
      <div className={styles.description}>
        <p className={styles.heading}>
          Description:
        </p>
        <p className={styles.content}>
          {damageDetails.description}
        </p>
      </div>
    </div>

  )
};

export default DamageDetails;
