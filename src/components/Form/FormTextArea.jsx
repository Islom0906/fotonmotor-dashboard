import React from 'react';
import {Form } from "antd";
import TextArea from "antd/es/input/TextArea";

const FormTextArea = ({label,name,required,required_text ,placeholder=''}) => {
    return (
        <Form.Item
            label={label}
            name={name}

            rules={[{
                required: required, message: required_text
            }]}
        >
            <TextArea placeholder={placeholder } rows={4}/>
        </Form.Item>
    );
};

export default FormTextArea;

