import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row, Typography, Upload} from "antd";
import {AppLoader, FormInput, FormTextArea} from "../../components";
import {useSelector} from "react-redux";
import {EditGetById, onPreviewImage, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import {useDeleteImagesQuery, useEditQuery, useGetByIdQuery, usePostQuery} from "../../service/query/Queries";
import {PlusOutlined} from "@ant-design/icons";

const {Title} = Typography

const initialValueForm = {
    banner: [],
    titleRu: "",
    titleUz: "",
    textRu: "",
    textUz: "",
    list: [
        {
            titleRu: "",
            titleUz: "",
            textRu: "",
            textUz: "",
            icon: []
        },
    ]
}


const imageInitial = {
    banner: [],
    icon: [[]],
}


const ServicePostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)

    const [fileListProps, setFileListProps] = useState(imageInitial);
    const [isUpload, setIsUpload] = useState("")
    const [mainIndex, setMainIndex] = useState(null)
    // query-service
    const {
        mutate: postServiceMutate,
        isLoading: postServiceLoading,
        isSuccess: postServiceSuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editServiceLoading,
        data: editServiceData,
        refetch: editServiceRefetch,
        isSuccess: editServiceSuccess
    } = useGetByIdQuery(false, "edit-service", editId, '/service')
    // put-query
    const {
        mutate: putService,
        isLoading: putServiceLoading,
        isSuccess: putServiceSuccess
    } = useEditQuery()
    // post image
    const {
        mutate: imagesUploadMutate,
        isSuccess: imagesUploadSuccess,
        data: imagesUpload
    } = usePostQuery()

    //delete image
    const {mutate: imagesDeleteMutate} = useDeleteImagesQuery()
    // ================================ useEffect =============================

    // service success
    SuccessCreateAndEdit(postServiceSuccess, putServiceSuccess, '/service')
    // if edit service
    EditGetById(editServiceRefetch)
    // if no edit service
    SetInitialValue(form, initialValueForm)


    //edit service
    useEffect(() => {
        if (editServiceSuccess) {
            const banner = [{
                uid: editServiceData?.banner?._id,
                name: editServiceData?.banner?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editServiceData.banner.path}`
            }];

            const icon = editServiceData.list.map(item => [{
                uid: item?.icon?._id,
                name: item?.icon?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${item?.icon?.path}`
            }]);


            const edit = {
                banner,
                titleRu: editServiceData.titleRu,
                titleUz: editServiceData.titleUz,
                textRu: editServiceData.textRu,
                textUz: editServiceData.textUz,
                list: editServiceData.list.map((item, index) => ({
                    titleRu: item.titleRu,
                    titleUz: item.titleUz,
                    textRu: item.textRu,
                    textUz: item.textUz,
                    icon: icon[index]
                })),
            }

            setFileListProps({
                banner,
                icon
            })
            form.setFieldsValue(edit)
        }

    }, [editServiceData])

    const onFinish = (value) => {
        const getFileUid = (file) => (Array.isArray(file) ? file[0]?.uid : file?.uid);

        const list = value.list.map((item, ind) => ({
            ...item,
            icon: getFileUid(fileListProps.icon[ind])
        }));

        const data = {
            ...value,
            banner: getFileUid(fileListProps.banner),
            list
        }

        if (editServiceData) {
            putService({url: '/service', data, id: editId})
        } else {
            postServiceMutate({url: "/service", data});
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
        if (name === 'banner') {
            form.setFieldValue({banner: value});
        } else if (name === 'icon') {
            const getValueBrand = form.getFieldValue('list')
            getValueBrand[index].icon = value
            form.setFieldsValue({
                list: [
                    ...getValueBrand,
                ]
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


            if (mainIndex !== null) {
                initialImage[isUpload][mainIndex] = [uploadImg]
            } else {
                initialImage[isUpload].push(uploadImg)
            }
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
            if (index === null) {
                changeFieldValue(name, [])
                id = {
                    ids: [fileListProps[name][0]?.uid]
                };
                deleteImageFileProps[name] = []

            } else {
                changeFieldValue(name, [], index)

                id = {
                    ids: [fileListProps[name][index][0]?.uid]
                };
                deleteImageFileProps[name][index] = []
            }

            imagesDeleteMutate({url: "/medias", id});
            setFileListProps(deleteImageFileProps)
        } else if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({url: "/medias", data: formData});
            setIsUpload(name)
            setMainIndex(index)
        }

    };

    const handleRemove = (name, remove, index, fileName) => {
        const deleteImage = {...fileListProps}
        const deleteImageUID = deleteImage[fileName][index]
        if (deleteImageUID) {

            deleteImage[fileName].splice(index, 1)
            const id = {
                ids: [deleteImageUID[0]?.uid]
            };
            imagesDeleteMutate({url: "/medias", id});
            setFileListProps(deleteImage)
        }

        remove(name);
    };


    return (<div>
        {(postServiceLoading || editServiceLoading || putServiceLoading) ?
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
                    <Col span={24}>
                        <Form.Item
                            label='Изображение баннера '
                            name={'banner'}
                            rules={[{required: true, message: 'Требуется изображение'}]}>
                            <Upload
                                maxCount={1}
                                fileList={fileListProps?.banner}
                                listType='picture-card'
                                onChange={(file) => onChangeImage(file, 'banner', null)}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps?.banner?.length > 0 ? "" : "Upload"}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется сервисе'}
                            label={'Название сервисе  Ru'}
                            name={'titleRu'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется сервисе'}
                            label={'Название сервисе  Uz'}
                            name={'titleUz'}
                        />
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
                        <Row>
                            <Col span={24} style={{marginTop:20}}>
                                <Title level={3}>Преимущества обслуживания</Title>
                            </Col>
                        </Row>
                        <Card bordered={true} style={{border: 1, borderStyle: "dashed", borderColor: "black"}}>
                            <Form.List name="list">
                                {(fields, {add, remove}) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Row key={field.key} gutter={20}>
                                                <Col span={12}>
                                                    <FormInput
                                                        required={true}
                                                        required_text={'Требуется название'}
                                                        label={`Название предпочтения службы #${index + 1} (RU)`}
                                                        name={[field.name, 'titleRu']}
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <FormInput
                                                        required={true}
                                                        required_text={'Требуется название'}
                                                        label={`Название предпочтения службы #${index + 1} (UZ)`}
                                                        name={[field.name, 'titleUz']}
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <FormTextArea
                                                        required={true}
                                                        required_text={'Требуется текст'}
                                                        label={`Текст предпочтений сервиса #${index + 1} (RU)`}
                                                        name={[field.name, 'textRu']}
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <FormTextArea
                                                        required={true}
                                                        required_text={'Требуется текст'}
                                                        label={`Текст предпочтений сервиса #${index + 1} (UZ)`}
                                                        name={[field.name, 'textUz']}
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label={`Изображение #${index + 1}`}
                                                        name={[field.name, 'icon']}
                                                        rules={[{required: true, message: 'Требуется изображение'}]}
                                                    >
                                                        <Upload
                                                            maxCount={1}
                                                            fileList={fileListProps?.icon ? fileListProps?.icon[index] : []}
                                                            listType='picture-card'
                                                            onChange={(file) => onChangeImage(file, 'icon', index)}
                                                            onPreview={onPreviewImage}
                                                            beforeUpload={() => false}
                                                        >
                                                            {fileListProps?.icon[index]?.length > 0 ? "" : "Upload"}
                                                        </Upload>
                                                    </Form.Item>
                                                </Col>

                                                <Col span={24}>
                                                    {index > 0 && (
                                                        <Button type="danger"
                                                                onClick={() => handleRemove(field.name, remove, index, 'icon')}>
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





                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editServiceSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default ServicePostEdit;