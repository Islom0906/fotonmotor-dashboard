import React from 'react';
import {Button, Image, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const MapTable = ({data,deleteHandle}) => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const Delete = async (id) => {
        deleteHandle('/map',id)
    };


    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch(editIdQuery(id))
        navigate('/map/add')
    };



    const columns = [
        {
            title: 'Имя дилера Ру',
            dataIndex: 'nameRu',
            id: 'nameRu',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Имя дилера Uz',
            dataIndex: 'nameUz',
            id: 'nameUz',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Адрес Ру',
            dataIndex: 'addressRu',
            id: 'addressRu',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Адрес Uz',
            dataIndex: 'addressUz',
            id: 'addressUz',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Working Time',
            dataIndex: 'workingTime',
            id: 'workingTime',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Tel',
            dataIndex: 'tel',
            id: 'tel',
            render: (text) => <p>{text}</p>,
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
                    <Popconfirm
                        title={'Вы уверены, что хотите удалить это?'}
                        description={'Удалить'}
                        onConfirm={() => Delete(record._id)}>
                        <Button  type='primary' danger icon={<DeleteOutlined />} />
                    </Popconfirm>
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

export default MapTable;