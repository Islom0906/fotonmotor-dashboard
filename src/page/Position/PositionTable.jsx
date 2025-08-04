import React from 'react';
import {Button, Popconfirm, Space, Table, Tag} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const PositionTable = ({data, deleteHandle}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const Delete = async (id) => {
        deleteHandle('/position', id)
    };


    const Edit = (id) => {
        localStorage.setItem('editDataId', id)
        dispatch(editIdQuery(id))
        navigate('/position/add')
    };


    const columns = [
        {
            title: 'Заголовок Ru',
            dataIndex: 'titleRu',
            id: 'titleRu',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Sarlavha Uz',
            dataIndex: 'titleUz',
            id: 'titleUz',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Модель',
            dataIndex: 'carId',
            id: 'carId',
            render: (text) => <p>{text?.name}</p>,
        },
        {
            title: 'Опции',
            dataIndex: 'list',
            id: 'list',
            render: (text) => <Space direction={"vertical"} >
                {

                    text.map(item=>(
                        <Tag key={item?._id}>{item?.titleRu}</Tag>
                    ))
                }
            </Space>
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
                        icon={<EditOutlined/>}/>
                    <Popconfirm
                        title={'Вы уверены, что хотите удалить это?'}
                        description={'Удалить'}
                        onConfirm={() => Delete(record._id)}>
                        <Button type='primary' danger icon={<DeleteOutlined/>}/>
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

export default PositionTable;