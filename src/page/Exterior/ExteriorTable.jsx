import React from 'react';
import {Button, Image, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const ExteriorTable = ({data,deleteHandle}) => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const Delete = async (id) => {
        deleteHandle('/exterior',id)
    };


    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch(editIdQuery(id))
        navigate('/exterior/add')
    };



    const columns = [
        {
            title: 'Название цвета',
            dataIndex: 'colorNameRu',
            id: 'colorNameRu',
            render: (text,record) => <p>{text} ({record?.positionId?.titleRu})</p>,
        },
        {
            title: 'Изображение автомобиля',
            dataIndex: 'carImage',
            id: 'carImage',
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
            title: 'Цветное изображение',
            dataIndex: 'colorImage',
            id: 'colorImage',
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

export default ExteriorTable;