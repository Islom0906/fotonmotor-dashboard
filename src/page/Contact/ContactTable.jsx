import React from 'react';
import {Button, Image, Popconfirm, Space, Table, Tag} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const ContactTable = ({data}) => {
    const navigate=useNavigate()
    const dispatch=useDispatch()



    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch(editIdQuery(id))
        navigate('/contact/add')
    };



    const columns = [

        {
            title: 'Facebook',
            dataIndex: 'facebook',
            id: 'facebook',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Youtube',
            dataIndex: 'youtube',
            id: 'youtube',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Instagram',
            dataIndex: 'instagram',
            id: 'instagram',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Телефон',
            dataIndex: 'tel',
            id: 'tel',
            render: (text) => <Space direction={"vertical"} >
                {

                    text.map((item,ind)=>(
                        <Tag key={ind}>{item}</Tag>
                    ))
                }
            </Space>,
        },
        {
            title: 'Событие',
            id: 'action',
            render: (_, record) => (
                <Space size={20}>
                    <Button
                        onClick={() => Edit(record._id)}
                        type='dashed'
                        out
                        icon={<EditOutlined />}/>

                </Space>
            ),
        },
    ];
    return <Table
            columns={columns}
            dataSource={data}
            rowKey={(record) => record._id}
        />

};

export default ContactTable;