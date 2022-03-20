import React from "react";
import {useState} from "react";
import {Modal as AntModal, Button} from "antd";

import 'antd/dist/antd.css';
import {Form} from "../Form/Form";

export const Modal = (props) => {
    return (
        <div>
            <AntModal title="Add new damage"
                      visible={props.isModalVisible}
                      onOk={props.handleOk}
                      onCancel={props.handleCancel}
                      okButtonProps={{form:'control-ref',  htmlType:"submit"}}
                      destroyOnClose={true}
            >
                <Form
                    onOk={props.handleOk}
                    lngLat={props.lngLat}
                />
            </AntModal>
        </div>
    );
};
