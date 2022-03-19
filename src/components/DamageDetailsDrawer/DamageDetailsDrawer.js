import React from 'react';

import { Drawer } from 'antd';

export const DamageDetailsDrawer = ({damageDetails, visible, onClose}) => {
  return (
    <Drawer placement={'bottom'} visible={visible} onClose={onClose}>damage details drawer</Drawer>
  )
};
