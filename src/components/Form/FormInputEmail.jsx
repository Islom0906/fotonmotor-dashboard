import React from 'react';
import {Form, Input} from "antd";

const FormInput = ({label,name,required,required_text}) => {
    const validateEmail = (rule, value, callback) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || emailRegex.test(value)) {
            callback();
        } else {
            callback('Please enter a valid email address');
        }
    };
    return (
        <Form.Item
            label={label}
            name={name}

            rules={[{
                required: required, message: required_text
            },
                { validator: validateEmail }
            ]}
        >
            <Input />
        </Form.Item>
    );
};

export default FormInput;

