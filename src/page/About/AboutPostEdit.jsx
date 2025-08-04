import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row, Typography, Upload} from "antd";
import {AppLoader, FormInput, FormTextArea} from "../../components";
import {useSelector} from "react-redux";
import {EditGetById, onPreviewImage, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import {useDeleteImagesQuery, useEditQuery, useGetByIdQuery, usePostQuery} from "../../service/query/Queries";
import {PlusOutlined} from "@ant-design/icons";

const {Title} = Typography

const initialValueForm = {
    bannerWeb: [],
    bannerRes: [],
    textRu: "",
    textUz: "",
    statistics: [
        {
            value: "",
            titleRu: "",
            titleUz: ""
        }
    ],
    missionRu: "",
    missionUz: "",
    objectivesRu: "",
    objectivesUz: "",
    valuesRu: "",
    valuesUz: "",
    aboutTextRu: "",
    aboutTextUz: "",
    aboutHome: {
        image: [],
        textRu: "",
        textUz: ""
    }
}


const imageInitial = {
    bannerWeb: [],
    bannerRes: [],
    aboutHomeImage: [],
}


const AboutPostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)

    const [fileListProps, setFileListProps] = useState(imageInitial);
    const [isUpload, setIsUpload] = useState("")
    const [mainIndex, setMainIndex] = useState(null)
    // query-about
    const {
        mutate: postAboutMutate,
        isLoading: postAboutLoading,
        isSuccess: postAboutSuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editAboutLoading,
        data: editAboutData,
        refetch: editAboutRefetch,
        isSuccess: editAboutSuccess
    } = useGetByIdQuery(false, "edit-about", editId, '/about')
    // put-query
    const {
        mutate: putAbout,
        isLoading: putAboutLoading,
        isSuccess: putAboutSuccess
    } = useEditQuery()
    // post image
    const {
        mutate: imagesUploadMutate,
        isSuccess: imagesUploadSuccess,
        isLoading: imagesUploadLoading,
        data: imagesUpload
    } = usePostQuery()

    //delete image
    const {mutate: imagesDeleteMutate} = useDeleteImagesQuery()
    // ================================ useEffect =============================

    // about success
    SuccessCreateAndEdit(postAboutSuccess, putAboutSuccess, '/about')
    // if edit about
    EditGetById(editAboutRefetch)
    // if no edit about
    SetInitialValue(form, initialValueForm)


    //edit about
    useEffect(() => {
        if (editAboutSuccess) {
            const bannerWeb = [{
                uid: editAboutData?.bannerWeb?._id,
                name: editAboutData?.bannerWeb?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editAboutData.bannerWeb.path}`
            }];
            const bannerRes = [{
                uid: editAboutData?.bannerRes?._id,
                name: editAboutData?.bannerRes?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editAboutData.bannerRes.path}`
            }];
            const aboutHomeImage = [{
                uid: editAboutData?.aboutHome?.image?._id,
                name: editAboutData?.aboutHome?.image?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editAboutData.aboutHome?.image.path}`
            }];
            const statistics=editAboutData?.statistics?.map(item=>{
                return{
                    value: item.value,
                    titleRu: item.titleRu,
                    titleUz: item.titleUz
                }
            })



            const edit = {
                bannerWeb,
                bannerRes,
                textRu: editAboutData.textRu,
                textUz: editAboutData.textUz,
                statistics,
                missionRu: editAboutData.missionRu,
                missionUz: editAboutData.missionUz,
                objectivesRu: editAboutData.objectivesRu,
                objectivesUz: editAboutData.objectivesUz,
                valuesRu: editAboutData.valuesRu,
                valuesUz: editAboutData.valuesUz,
                aboutTextRu: editAboutData.aboutTextRu,
                aboutTextUz: editAboutData.aboutTextUz,
                aboutHome: {
                    image: aboutHomeImage,
                    textRu: editAboutData.textRu,
                    textUz: editAboutData.textUz
                }
            }

            setFileListProps({
                bannerWeb,
                bannerRes,
                aboutHomeImage,
            })
            form.setFieldsValue(edit)
        }

    }, [editAboutData])

    const onFinish = (value) => {

        const data = {
            bannerWeb: fileListProps['bannerWeb'][0]?.uid,
            bannerRes: fileListProps['bannerRes'][0]?.uid,
            textRu: value.textRu,
            textUz: value.textUz,
            statistics:value.statistics,
            missionRu:value.missionRu,
            missionUz:value.missionUz,
            objectivesRu:value.objectivesRu,
            objectivesUz:value.objectivesUz,
            valuesRu:value.valuesRu,
            valuesUz:value.valuesUz,
            aboutTextRu:value.aboutTextRu,
            aboutTextUz:value.aboutTextUz,
            aboutHome: {
                image: fileListProps['aboutHomeImage'][0]?.uid,
                textRu: value.textRu,
                textUz: value.textUz
            }
        }

        if (editAboutData) {
            putAbout({url: '/about', data, id: editId})
        } else {
            postAboutMutate({url: "/about", data});
        }
    }


    // refresh page again get data
    useEffect(() => {


        const handleBeforeUnload = (event) => {
            event.preventDefault()

        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            localStorage.removeItem('editDataId')
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);
    // image

    const changeFieldValue = (name, value, index) => {
        if (name === 'bannerWeb') {
            form.setFieldValue({bannerWeb: value});
        } else if (name === 'bannerRes') {
            form.setFieldValue({bannerRes: value});
        } else if (name === 'aboutHomeImage') {
            const getValueBrand = form.getFieldValue('aboutHome')
            getValueBrand.image = value
            form.setFieldsValue({
                aboutHome: {
                    ...getValueBrand,
                }
            });
        }
    }
    useEffect(() => {
        // images
        if (imagesUploadSuccess && isUpload) {
            const initialImage = {...fileListProps}
            const uploadImg = {
                uid: imagesUpload[0]?._id,
                name: imagesUpload[0]?._id,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${imagesUpload[0]?.path}`
            }


                initialImage[isUpload].push(uploadImg)
            changeFieldValue(isUpload, [uploadImg], mainIndex)
            setFileListProps(initialImage);
            setIsUpload("")
            setMainIndex(null)
        }
    }, [imagesUpload]);

    const onChangeImage = ({fileList: newFileList}, name, index) => {
        const formData = new FormData();
        let id = {}
        const checkFileProps = index === null ? fileListProps[name]?.length : fileListProps[name][index]?.length
        if (checkFileProps || newFileList.length === 0) {
            const deleteImageFileProps = {...fileListProps}
                changeFieldValue(name, [])
                id = {
                    ids: [fileListProps[name][0]?.uid]
                };
                deleteImageFileProps[name] = []



            imagesDeleteMutate({url: "/medias", id});
            setFileListProps(deleteImageFileProps)
        } else if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({url: "/medias", data: formData});
            setIsUpload(name)
            setMainIndex(index)
        }

    };



    return (<div>
        {(postAboutLoading || editAboutLoading || putAboutLoading) ?
            <AppLoader/> :
            <Form
                form={form}
                name="basic"
                labelCol={{
                    span: 24
                }}
                wrapperCol={{
                    span: 24
                }}
                style={{
                    maxWidth: "100%"
                }}
                initialValues={initialValueForm}
                onFinish={onFinish}
                autoComplete="off"
            >


                <Row gutter={20}>
                    <Col span={24}>

                    <Title level={3}>О Баннере</Title>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Изображение баннера на вебе'
                            name={'bannerWeb'}
                            rules={[{required: true, message: 'Требуется изображение'}]}>
                            <Upload
                                maxCount={1}
                                fileList={fileListProps?.bannerWeb}
                                listType='picture-card'
                                onChange={(file) => onChangeImage(file, 'bannerWeb', null)}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps?.bannerWeb?.length > 0 ? "" : "Upload"}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Изображение баннера для мобильных устройств'
                            name={'bannerRes'}
                            rules={[{required: true, message: 'Требуется изображение'}]}>
                            <Upload
                                maxCount={1}
                                fileList={fileListProps?.bannerRes}
                                listType='picture-card'
                                onChange={(file) => onChangeImage(file, 'bannerRes', null)}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps?.bannerRes?.length > 0 ? "" : "Upload"}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <FormTextArea
                            required={true}
                            required_text={'Требуется описание'}
                            label={'Краткое описание Ru'}
                            name={'textRu'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormTextArea
                            required={true}
                            required_text={'Tavsif talab qilinadi'}
                            label={'Краткое описание Uz'}
                            name={'textUz'}
                        />
                    </Col>
                    <Col span={24}>
                        <Card bordered={true} style={{border: 1, borderStyle: "dashed", borderColor: "black"}}>
                            <Form.List name="statistics">
                                {(fields, {add, remove}) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Row key={field.key} gutter={20}>
                                                <Col span={8}>
                                                    <FormInput
                                                        required={true}
                                                        required_text={'Требуется заголовок'}
                                                        label={`Название статистики #${index + 1} (RU)`}
                                                        name={[field.name, 'titleRu']}
                                                    />
                                                </Col>
                                                <Col span={8}>
                                                    <FormInput
                                                        required={true}
                                                        required_text={'Требуется заголовок'}
                                                        label={`Название статистики #${index + 1} (UZ)`}
                                                        name={[field.name, 'titleUz']}
                                                    />
                                                </Col>
                                                <Col span={8}>
                                                    <FormInput
                                                        required={true}
                                                        required_text={'Требуется результат'}
                                                        label={`Результат ${index + 1} `}
                                                        name={[field.name, 'value']}
                                                    />
                                                </Col>

                                                <Col span={24}>
                                                    {index > 0 && (
                                                        <Button type="danger"
                                                                onClick={() => remove(field.name)}>
                                                            Удалить
                                                        </Button>
                                                    )}
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                                Добавить значение бренда
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24} style={{marginTop:20}}>

                        <Title level={3}>Преимущества и подробности</Title>
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется'}
                            label={'Миссия Ru'}
                            name={'missionRu'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется'}
                            label={'Миссия Uz'}
                            name={'missionUz'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется'}
                            label={'Цели и задачи Ru'}
                            name={'objectivesRu'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется'}
                            label={'Цели и задачи Uz'}
                            name={'objectivesUz'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется'}
                            label={'Главные ценности Ru'}
                            name={'valuesRu'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется'}
                            label={'Главные ценности Uz'}
                            name={'valuesUz'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormTextArea
                            required={true}
                            required_text={'Требуется'}
                            label={'Полная информация о компании Ru'}
                            name={'aboutTextRu'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormTextArea
                            required={true}
                            required_text={'Требуется'}
                            label={'Kompaniya haqida to\'lig\' malumot Ru'}
                            name={'aboutTextUz'}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24} style={{marginTop:20}}>

                        <Title level={3}>Главная страница о разделе</Title>
                    </Col>
                    <Col span={12}>
                        <FormTextArea
                            required={true}
                            required_text={'Требуется описание'}
                            label={'О разделе текст в домашнем Ru'}
                            name={['aboutHome', 'textRu']}
                        />
                    </Col>
                    <Col span={12}>
                        <FormTextArea
                            required={true}
                            required_text={'Tavsif talab qilinadi'}
                            label={'О разделе текст в домашнем Uz'}
                            name={['aboutHome', 'textUz']}
                        />
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='О разделе изображение на главной странице'
                            name={['aboutHome', 'image']}
                            rules={[{required: true, message: 'Требуется изображение'}]}>
                            <Upload
                                maxCount={1}
                                fileList={fileListProps?.aboutHomeImage}
                                listType='picture-card'
                                onChange={(file) => onChangeImage(file, 'aboutHomeImage', null)}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps?.aboutHomeImage?.length > 0 ? "" : "Upload"}
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>


                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editAboutSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default AboutPostEdit;