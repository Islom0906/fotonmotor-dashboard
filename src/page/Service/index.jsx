import {Button, Col,  Row, Typography, Space, Spin} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import ServiceTable from "./ServiceTable";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import { useGetQuery} from "../../service/query/Queries";

const {Title} = Typography


const Service = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // get
    const {data,isLoading:getBannerLoading,refetch}=useGetQuery(false,'service-get','/service/',false)




    useEffect(() => {
        refetch()
    }, []);



    // add
    const addArticle = () => {
        dispatch(editIdQuery(""));
        navigate('/service/add');
    };


    return (
        <div className={'site-space-compact-wrapper'}>
            <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
                <Row gutter={20}>
                    <Col span={24}>
                        <Title level={2}>
                            Сервисе
                        </Title>
                    </Col>

                    <Col offset={16} span={8}>
                        <Button
                            disabled={data?.titleRu}
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
                    spinning={getBannerLoading }>
                    <ServiceTable
                        data={data ? [data]:[]}
                    />
                </Spin>
            </Space>
        </div>
    );
};

export default Service;

