import { Form as AntForm, Input, Select, notification } from 'antd';
import React from "react";
import {sendDamageReport} from "../SendDamageReport/SendDamageReport";

const { Option } = Select;
const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 16,
    },
};

export const Form = (props) => {
    const url = 'https://ua-damage-map-api-prod.herokuapp.com/damage-report';
    let formRef = React.createRef();

    const onFinish = (values) => {
        sendDamageReport(url, {
            ...values,
            latitude: props.lngLat[1],
            longitude: props.lngLat[0]
        })
            .then(data => {
                props.onOk();
            })
        notification.open({
            message: 'Report was added successfully',
            description:
                'Thank you for your commitment. You will definitely make life easier for others. May free Ukraine live!',
        });
    };
        return (
            <AntForm {...layout} ref={formRef} name="control-ref" onFinish={onFinish}>
                <AntForm.Item
                    name="description"
                    label="Description"
                    rules={[
                        {
                            required: false,
                            max: 300,
                        },
                    ]}
                >
                    <Input.TextArea />
                </AntForm.Item>
                <AntForm.Item
                    name="damageDegree"
                    label="Damage degree"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        placeholder="Select a option "
                        allowClear
                    >
                        <Option value="worksCorrectly">Work correctly</Option>
                        <Option value="worksPartially">Work partially</Option>
                        <Option value="doesNotWork">Does not work</Option>
                    </Select>
                </AntForm.Item>
            </AntForm>
        );

}