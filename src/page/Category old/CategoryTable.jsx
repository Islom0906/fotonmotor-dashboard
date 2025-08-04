import React from 'react';
import {Button, Image, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const CategoryTable = ({data,deleteHandle}) => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const Delete = async (id) => {
        deleteHandle('/category',id)
    };


    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch(editIdQuery(id))
        navigate('/category/add')
    };



    const columns = [
        {
            title: 'Название категории Ru',
            dataIndex: 'nameRu',
            id: 'nameRu',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Название категории Uz',
            dataIndex: 'nameUz',
            id: 'nameUz',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Изображение категории',
            dataIndex: 'image',
            id: 'image',
            render: (image) => {
                return (
                    <Image
                        width={50}
                        height={50}
                        src={`${process.env.REACT_APP_API_URL}/${image?.path}`}
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

export default CategoryTable;