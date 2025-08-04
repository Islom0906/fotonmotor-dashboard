import React from 'react';
import {Form, Input} from "antd";

const FormInput = ({label,name,required,required_text,warning,disabled=false,addonBefore}) => {
    return (
        <Form.Item
            label={warning ? <div>
                <p>{label}</p>
                <br/>
                <p>{warning}</p>
            </div>:<div>{label}</div>}
            name={name}

            rules={[{
                required: required, message: required_text
            }]}
        >
            {
                addonBefore ? <Input addonBefore={addonBefore} disabled={disabled}/>: <Input disabled={disabled}/>
            }
        </Form.Item>
    );
};

export default FormInput;
