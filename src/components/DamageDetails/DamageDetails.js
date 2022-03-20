import React from 'react';
import cn from 'classnames';
import styles from './DamageDetails.module.scss';
import { Tag } from 'antd';

export const DamageDetails = ({damageDetails}) => {
    const text = {
        worksCorrectly: 'It works correctly!',
        worksPartially: 'It works partially!',
        doesNotWork: 'It does not work!'
    }[damageDetails.damageDegree];

    const renderCategories = () => {
        const categories = damageDetails.placeCategory?.split(',');
        if (categories) {
          return (
            <div className={styles.placeCategory}>
              {categories.map((category, categoryIndex) => (
                <Tag color={'#1890ff'} key={categoryIndex}>
                  {category}
                </Tag>
              ))}
            </div>
            )
        }
        return null;
    };

  return (
    <div className={styles.wrapper}>
      <div className={styles.damageDegree}>
        {renderCategories()}
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
