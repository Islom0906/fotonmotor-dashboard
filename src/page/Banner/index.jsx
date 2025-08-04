import {Button, Col,  Row, Typography, Space, Spin} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import BannerHomeTable from "./BannerHomeTable";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDeleteQuery, useGetQuery} from "../../service/query/Queries";

const {Title} = Typography


const BannerHome = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // delete
    const {mutate,isSuccess,isLoading:deleteLoading}=useDeleteQuery()
    // get
    const {data,isLoading:getBannerLoading,refetch}=useGetQuery(false,'banner-get','/banner/',false)




    useEffect(() => {
        refetch()
    }, [isSuccess]);

    // delete
    const deleteHandle = (url, id) => {
        mutate({url, id});

    };

    // add
    const addArticle = () => {
        dispatch(editIdQuery(""));
        navigate('/banner/add');
    };


    return (
        <div className={'site-space-compact-wrapper'}>
            <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
                <Row gutter={20}>
                    <Col span={24}>
                        <Title level={2}>
                            Баннер
                        </Title>
                    </Col>

                    <Col offset={16} span={8}>
                        <Button
                            disabled={data?.length!==0}
                            type='primary'
                            icon={<PlusOutlined/>}
                            style={{width: '100%'}}
                            onClick={addArticle}>
                            Добавить
                        </Button>
                    </Col>

                </Row>
                <Spin
                    size='medium'
                    spinning={getBannerLoading || deleteLoading}>
                    <BannerHomeTable
                        data={data}
                        deleteHandle={deleteHandle}
                    />
                </Spin>
            </Space>
        </div>
    );
};

export default BannerHome;

