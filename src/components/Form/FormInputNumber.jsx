import React from 'react';
import {Form,  InputNumber} from "antd";

const FormInputNumber = ({label,name,required,required_text}) => {
    return (
        <Form.Item
            label={label}
            name={name}

            rules={[{
                required: required, message: required_text
            }]}
        >
            <InputNumber  style={{width:'100%'}}/>
        </Form.Item>
    );
};

export default FormInputNumber;
