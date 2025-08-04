import {Button, Col,  Row, Typography, Space, Spin} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import ContactTable from "./ContactTable";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDeleteQuery, useGetQuery} from "../../service/query/Queries";

const {Title} = Typography


const Contact = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // get
    const {data,isLoading:getBannerLoading,refetch}=useGetQuery(false,'contact-get','/contact/',false)

    useEffect(() => {
        refetch()
    }, []);



    // add
    const addArticle = () => {
        dispatch(editIdQuery(""));
        navigate('/contact/add');
    };


    return (
        <div className={'site-space-compact-wrapper'}>
            <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
                <Row gutter={20}>
                    <Col span={24}>
                        <Title level={2}>
                            Контакт
                        </Title>
                    </Col>

                    <Col offset={16} span={8}>
                        <Button
                            type='primary'
                            disabled={data?.telegram}
                            icon={<PlusOutlined/>}
                            style={{width: '100%'}}
                            onClick={addArticle}>
                            Добавить
                        </Button>
                    </Col>

                </Row>
                <Spin
                    size='medium'
                    spinning={getBannerLoading}>
                    <ContactTable
                        data={data ? [data]:[]}
                    />
                </Spin>
            </Space>
        </div>
    );
};

export default Contact;

