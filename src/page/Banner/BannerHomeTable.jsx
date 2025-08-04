import React from 'react';
import {Button, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const BannerHomeTable = ({data,deleteHandle}) => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const Delete = async (id) => {
        deleteHandle('/banner', id)
    };


    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch(editIdQuery(id))
        navigate('/banner/add')
    };



    const columns = [
        {
            title: 'Резерв мощности',
            dataIndex: 'powerReserve',
            id: 'powerReserve',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Пиковая мощность',
            dataIndex: 'peakPower',
            id: 'peakPower',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Ускорение',
            dataIndex: 'acceleration',
            id: 'acceleration',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Видео',
            dataIndex: 'video',
            id: 'video',
            render: (video) => {
                return  video && (<video width={100} controls>
                        <source
                            src={`${process.env.REACT_APP_API_URL}/${video?.path}`}
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>)

            }
        },
        {
            title: 'Событие',
            id: 'action',
            render: (_, record) => (
                <Space size={20}>
                    <Button
                        onClick={() => Edit(record._id)}
                        type='dashed'
                        icon={<EditOutlined />}
                    />
                    <Popconfirm
                        title={'Вы уверены, что хотите удалить это?'}
                        description={'Удалить'}
                        onConfirm={() => Delete(record._id)}>
                        <Button type='primary' danger icon={<DeleteOutlined />} />
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

export default BannerHomeTable;