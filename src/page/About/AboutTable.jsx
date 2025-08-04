import React from 'react';
import {Button, Image, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const AboutTable = ({data}) => {
    const navigate=useNavigate()
    const dispatch=useDispatch()



    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch(editIdQuery(id))
        navigate('/about/add')
    };



    const columns = [

        {
            title: 'Изображение баннер рабочий стол',
            dataIndex: 'bannerWeb',
            id: 'bannerWeb',
            render: (image) => {
                return (
                    <Image
                        width={50}
                        height={50}
                        src={`${process.env.REACT_APP_API_URL}/${image.path}`}
                    />
                )},
        },
        {
            title: 'Изображение баннер рабочий стол',
            dataIndex: 'bannerRes',
            id: 'bannerRes',
            render: (image) => {
                return (
                    <Image
                        width={50}
                        height={50}
                        src={`${process.env.REACT_APP_API_URL}/${image.path}`}
                    />
                )},
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

export default AboutTable;