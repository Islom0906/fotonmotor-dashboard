import React, {useEffect, useMemo, useState} from 'react';
import {Button, Card, Col, Form, Row, Select, Typography, Upload} from "antd";
import {AppLoader, FormInput, FormTextArea} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {EditGetById, onPreviewImage, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import {useDeleteImagesQuery, useEditQuery, useGetByIdQuery, usePostQuery} from "../../service/query/Queries";
import {PlusOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {changeFieldValue, EditCar} from "./car.helper";
import {imageInitial, initialValueForm} from "./car.config";

const {Title} = Typography

const cardStyle = {border: 1, borderStyle: "dashed", borderColor: "black"}



const CarPostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    const dispatch = useDispatch()
    const [fileListProps, setFileListProps] = useState(imageInitial);
    const [isUpload, setIsUpload] = useState("")
    const [mainIndex, setMainIndex] = useState(null)
    // query-car
    const {
        mutate: postCarMutate,
        isLoading: postCarLoading,
        isSuccess: postCarSuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editCarLoading,
        data: editCarData,
        refetch: editCarRefetch,
        isSuccess: editCarSuccess
    } = useGetByIdQuery(false, "edit-car", editId, '/car/id')
    // put-query
    const {
        mutate: putCar,
        isLoading: putCarLoading,
        isSuccess: putCarSuccess
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

    // car success
    SuccessCreateAndEdit(postCarSuccess, putCarSuccess, '/car')
    // if edit car
    EditGetById(editCarRefetch)
    // if no edit car
    SetInitialValue(form, initialValueForm)


    //edit car
    EditCar(form, setFileListProps, editCarData, editCarSuccess)


    const onFinish = (value) => {
        console.log(value)
        const getFileUid = (file) => (Array.isArray(file) ? file[0]?.uid : file?.uid);
        // Process expensive list items
        const exteriorReviewList = value.exteriorReview.list.map((item, ind) => ({
            ...item,
            image: getFileUid(fileListProps.exteriorReviewListImage[ind])
        }));
        const interiorReviewList = fileListProps.interiorReviewListImage.map((item) => item.uid);

        const data = {
            ...value,
            bannerWeb: getFileUid(fileListProps.bannerWeb),
            bannerRes: getFileUid(fileListProps.bannerRes),
            exteriorReview: {
                ...value.exteriorReview,
                bannerImage: getFileUid(fileListProps.exteriorReviewBanner),
                list: exteriorReviewList
            },
            interiorReview: {
                ...value.interiorReview,
                bannerImage: getFileUid(fileListProps.interiorReviewBanner),
                list: interiorReviewList
            },
            equipment: {
                ...value.equipment,
                image: getFileUid(fileListProps.equipmentImage),
                pdf: getFileUid(fileListProps.equipmentPdf),
            },
            technicalCharacter: value.technicalCharacter.map((item, index) => ({
                ...item,
                image: getFileUid(fileListProps.technicalCharacterImage[index]),
            })),
            imageHome: getFileUid(fileListProps.imageHome),
        };

        console.log(data)

        if (editCarData) {
            putCar({url: '/car', data, id: editId})
        } else {
            postCarMutate({url: "/car", data});
        }
    }

    console.log(fileListProps)
    // refresh page again get data
    useEffect(() => {


        const handleBeforeUnload = (event) => {
            event.preventDefault()
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            setFileListProps(imageInitial)
            dispatch(editIdQuery(''))
            localStorage.removeItem('editDataId')
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);
    // image


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
            changeFieldValue(form, isUpload, [uploadImg], mainIndex)
            setFileListProps(initialImage);
            setIsUpload("")
            setMainIndex(null)
        }
    }, [imagesUpload]);

    const onChangeImage = (info, name, index = null, multiple = false) => {
        const {fileList: newFileList, file} = info
        const formData = new FormData();
        let id = {}
        let multipleDeleteIndex = null
        if (multiple && file?.status === 'removed') {
            fileListProps[name].map((item, ind) => {
                console.log(item, newFileList)
                if (item?.uid === file?.uid) {
                    multipleDeleteIndex = ind
                }
            })
        }


        if (file?.status === 'removed') {
            const deleteImageFileProps = {...fileListProps}
            if (index === null) {
                changeFieldValue(form, name, [])
                id = {
                    ids: multiple ? [fileListProps[name][multipleDeleteIndex]?.uid] : [fileListProps[name][0]?.uid]
                };
                if (multiple) {
                    deleteImageFileProps[name].splice(multipleDeleteIndex, 1)
                } else {
                    deleteImageFileProps[name] = []
                }

            } else {
                changeFieldValue(form, name, [], index)

                id = {
                    ids: [fileListProps[name][index][0]?.uid]
                };
                deleteImageFileProps[name][index] = []
            }
            imagesDeleteMutate({url: "/medias", id});
            setFileListProps(deleteImageFileProps)
        } else if (newFileList.length !== 0 && newFileList[newFileList.length - 1].originFileObj) {
            formData.append("media", multiple ? newFileList[newFileList.length - 1].originFileObj : newFileList[0].originFileObj);
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
    // option
    const optionsTestDrive = useMemo(() => {

        return [
            {
                value: true,
                label: 'Да, есть',
            },
            {
                value: false,
                label: 'Нет',
            },

        ]


    }, []);


    return (<div>
        {(postCarLoading || editCarLoading || putCarLoading) ?
            <AppLoader/> :
            <Form
                form={form}
                name="carForm"
                labelCol={{span: 24}}
                wrapperCol={{span: 24}}
                style={{maxWidth: "100%"}}
                initialValues={initialValueForm}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={20}>
                    <Col span={24}>
                        <Title level={3}>О Баннере</Title>
                    </Col>
                    <Col span={24}>
                        <FormInput
                            required={true}
                            required_text="Требуется  модель "
                            label="Модель автомобиля"
                            name="name"
                        />
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Изображение баннера Web"
                            name="bannerWeb"
                            rules={[{required: true, message: "Требуется изображение баннера Web"}]}
                        >
                            <Upload
                                maxCount={1}
                                fileList={fileListProps?.bannerWeb}
                                listType="picture-card"
                                onChange={(file) => onChangeImage(file, "bannerWeb")}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps?.bannerWeb?.length > 0 ? "" : "Upload"}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Изображение баннера Res"
                            name="bannerRes"
                            rules={[{required: true, message: "Требуется изображение баннера Res"}]}
                        >
                            <Upload
                                maxCount={1}
                                fileList={fileListProps?.bannerRes}
                                listType="picture-card"
                                onChange={(file) => onChangeImage(file, "bannerRes")}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps?.bannerRes?.length > 0 ? "" : "Upload"}
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text="Требуется описание модели (RU)"
                            label="Описание модели (RU)"
                            name="modelDescriptionRu"
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text="Требуется описание модели (UZ)"
                            label="Описание модели (UZ)"
                            name="modelDescriptionUz"
                        />
                    </Col>

                    <Col span={24}>
                        <Title level={3}>Характеристики</Title>
                    </Col>

                    <Col span={24}>
                        <Card bordered={true} style={cardStyle}>

                            <Form.List name="character">
                                {(fields, {add, remove}) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Row key={field.key} gutter={20}>
                                                <Col span={12}>
                                                    <FormInput
                                                        required={true}
                                                        required_text="Требуется ключ Ru"
                                                        label={`Ключ #${index + 1} (RU)`}
                                                        name={[field.name, "keyRu"]}
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <FormInput
                                                        required={true}
                                                        required_text="Требуется ключ Uz"
                                                        label={`Ключ #${index + 1} (UZ)`}
                                                        name={[field.name, "keyUz"]}
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <FormInput
                                                        required={true}
                                                        required_text="Требуется значение Ru"
                                                        label={`Значение #${index + 1} (RU)`}
                                                        name={[field.name, "valueRu"]}
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <FormInput
                                                        required={true}
                                                        required_text="Требуется значение Uz"
                                                        label={`Значение #${index + 1} (UZ)`}
                                                        name={[field.name, "valueUz"]}
                                                    />
                                                </Col>

                                                <Col span={24}>
                                                    {index > 0 && (
                                                        <Button type="danger" onClick={() => remove(field.name)}>
                                                            Удалить
                                                        </Button>
                                                    )}
                                                </Col>
                                            </Row>
                                        ))}

                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                                Добавить характеристику
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Title level={3} style={{marginTop: 20}}>Обзор Экстерьера</Title>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Изображение баннера экстрерьера"
                            name={["exteriorReview", "bannerImage"]}
                            rules={[{required: true, message: "Требуется изображение баннера"}]}
                        >
                            <Upload
                                maxCount={1}
                                fileList={fileListProps?.exteriorReviewBanner}
                                listType="picture-card"
                                onChange={(file) => onChangeImage(file, "exteriorReviewBanner")}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps?.exteriorReviewBanner?.length > 0 ? "" : "Upload"}
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <FormTextArea
                            required={true}
                            required_text="Требуется текст (RU)"
                            label="Текст (RU)"
                            name={["exteriorReview", "textRu"]}
                        />
                    </Col>
                    <Col span={12}>
                        <FormTextArea
                            required={true}
                            required_text="Требуется текст (UZ)"
                            label="Текст (UZ)"
                            name={["exteriorReview", "textUz"]}
                        />
                    </Col>

                    <Col span={24}>
                        <Card bordered={true} style={cardStyle}>

                            <Form.List name={["exteriorReview", "list"]}>
                            {(fields, {add, remove}) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Row key={field.key} gutter={20}>
                                            <Col span={12}>
                                                <FormInput
                                                    required={true}
                                                    required_text="Требуется название Ru"
                                                    label={`Название #${index + 1} (RU)`}
                                                    name={[field.name, "titleRu"]}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <FormInput
                                                    required={true}
                                                    required_text="Требуется название Uz"
                                                    label={`Название #${index + 1} (UZ)`}
                                                    name={[field.name, "titleUz"]}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <FormTextArea
                                                    required={true}
                                                    required_text="Требуется текст (RU)"
                                                    label={`Текст #${index + 1} (RU)`}
                                                    name={[field.name, "textRu"]}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <FormTextArea
                                                    required={true}
                                                    required_text="Требуется текст (UZ)"
                                                    label={`Текст #${index + 1} (UZ)`}
                                                    name={[field.name, "textUz"]}
                                                />
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item
                                                    label={`Экстерьер слайда #${index + 1}`}
                                                    name={[field.name, 'image']}
                                                    rules={[{required: true, message: 'Требуется изображение'}]}
                                                >
                                                    <Upload
                                                        maxCount={1}
                                                        fileList={fileListProps?.exteriorReviewListImage ? fileListProps?.exteriorReviewListImage[index] : []}
                                                        listType='picture-card'
                                                        onChange={(file) => onChangeImage(file, 'exteriorReviewListImage', index)}
                                                        onPreview={onPreviewImage}
                                                        beforeUpload={() => false}
                                                    >
                                                        {fileListProps?.exteriorReviewListImage[index]?.length > 0 ? "" : "Upload"}
                                                    </Upload>
                                                </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                                {
                                                    index>0 && (

                                                <Button type="danger"
                                                        onClick={() => handleRemove(field.name, remove, index, 'exteriorReviewListImage')}>
                                                    Удалить
                                                </Button>
                                                    )
                                                }

                                            </Col>
                                        </Row>
                                    ))}

                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                            Добавить элемент экстрерьера
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                            </Form.List>
                        </Card>

                    </Col>

                    <Col span={24}>
                        <Title level={3} style={{marginTop:20}}>Интерьер</Title>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Изображение баннера интерьера"
                            name={["interiorReview", "bannerImage"]}
                            rules={[{required: true, message: "Требуется изображение баннера"}]}
                        >
                            <Upload
                                maxCount={1}
                                fileList={fileListProps?.interiorReviewBanner}
                                listType="picture-card"
                                onChange={(file) => onChangeImage(file, "interiorReviewBanner")}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps?.interiorReviewBanner?.length > 0 ? "" : "Upload"}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text="Требуется текст Ru"
                            label="Текст Ru"
                            name={["interiorReview", "titleRu"]}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text="Требуется текст Uz"
                            label="Текст Uz"
                            name={["interiorReview", "titleUz"]}
                        />
                    </Col>
                    <Col span={12}>
                        <FormTextArea
                            required={true}
                            required_text="Требуется текст Ru"
                            label="Текст Ru"
                            name={["interiorReview", "textRu"]}
                        />
                    </Col>
                    <Col span={12}>
                        <FormTextArea
                            required={true}
                            required_text="Требуется текст Uz"
                            label="Текст Uz"
                            name={["interiorReview", "textUz"]}
                        />
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Изображение баннера интерьера"
                            name={["interiorReview", "list"]}
                            rules={[{required: true, message: "Требуется изображение баннера"}]}
                        >
                            <Upload
                                maxCount={5}
                                multiple
                                fileList={fileListProps?.interiorReviewListImage}
                                listType="picture-card"
                                onChange={(file) => onChangeImage(file, "interiorReviewListImage", null, true)}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps?.interiorReviewListImage?.length > 4 ? "" : "Upload"}
                            </Upload>
                        </Form.Item>
                    </Col>

                </Row>
                <Row gutter={20}>
                    <Col span={24}>
                        <Title level={3} style={{marginTop:20}}>Оборудование</Title>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Изображение оборудования"
                            name={["equipment", "image"]}
                            rules={[{required: true, message: "Требуется изображение оборудования"}]}
                        >
                            <Upload
                                maxCount={1}
                                fileList={fileListProps?.equipmentImage}
                                listType="picture-card"
                                onChange={(file) => onChangeImage(file, "equipmentImage")}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps?.equipmentImage?.length > 0 ? "" : "Upload"}
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="PDF файл оборудования"
                            name={["equipment", "pdf"]}
                            rules={[{required: true, message: "Требуется PDF файл оборудования"}]}
                        >
                            <Upload
                                maxCount={1}
                                fileList={fileListProps?.equipmentPdf}
                                listType="picture-card"
                                onChange={(file) => onChangeImage(file, "equipmentPdf")}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps?.equipmentPdf?.length > 0 ? "" : "Upload PDF"}
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Card bordered={true} style={cardStyle}>
                            <Form.List name={["equipment", "list"]}>
                            {(fields, {add, remove}) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Row key={field.key} gutter={20}>
                                            <Col span={12}>
                                                <FormInput
                                                    required={true}
                                                    required_text="Требуется текст оборудования Ru"
                                                    label={`Текст оборудования #${index + 1} (RU)`}
                                                    name={[field.name, "textRu"]}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <FormInput
                                                    required={true}
                                                    required_text="Требуется текст оборудования Uz"
                                                    label={`Текст оборудования #${index + 1} (UZ)`}
                                                    name={[field.name, "textUz"]}
                                                />
                                            </Col>

                                            <Col span={24}>
                                                {index > 0 && (
                                                    <Button type="danger" onClick={() => remove(field.name)}>
                                                        Удалить
                                                    </Button>
                                                )}
                                            </Col>
                                        </Row>
                                    ))}

                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                            Добавить элемент оборудования
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                        </Card>

                    </Col>

                    {/* Технические характеристики (Technical Character) */}
                    <Col span={24}>
                        <Title level={3} style={{marginTop:20}}>Технические характеристики</Title>
                    </Col>
                    <Card bordered={true} style={cardStyle}>

                    <Form.List name="technicalCharacter">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map((field, index) => (
                                    <Row key={field.key} gutter={20}>

                                        <Col span={12}>
                                            <FormInput
                                                required={true}
                                                required_text="Требуется заголовок Ru"
                                                label={`Заголовок #${index + 1} (RU)`}
                                                name={[field.name, "titleRu"]}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <FormInput
                                                required={true}
                                                required_text="Требуется заголовок Uz"
                                                label={`Заголовок #${index + 1} (UZ)`}
                                                name={[field.name, "titleUz"]}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <FormInput
                                                required={true}
                                                required_text="Требуется текст Ru"
                                                label={`Текст #${index + 1} (RU)`}
                                                name={[field.name, "textRu"]}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <FormInput
                                                required={true}
                                                required_text="Требуется текст Uz"
                                                label={`Текст #${index + 1} (UZ)`}
                                                name={[field.name, "textUz"]}
                                            />
                                        </Col>


                                        <Col span={12}>

                                            <Form.Item
                                                label={`Изображение технических характеристик #${index + 1}`}
                                                name={[field.name, 'image']}
                                                rules={[{required: true, message: 'Требуется изображение'}]}
                                            >
                                                <Upload
                                                    maxCount={1}
                                                    fileList={fileListProps?.technicalCharacterImage ? fileListProps?.technicalCharacterImage[index] : []}
                                                    listType='picture-card'
                                                    onChange={(file) => onChangeImage(file, 'technicalCharacterImage', index)}
                                                    onPreview={onPreviewImage}
                                                    beforeUpload={() => false}
                                                >
                                                    {fileListProps?.technicalCharacterImage[index]?.length > 0 ? "" : "Upload"}
                                                </Upload>
                                            </Form.Item>
                                        </Col>

                                        <Col span={24}>
                                            {index > 0 && (
                                                <Button type="danger"
                                                        onClick={() => handleRemove(field.name, remove, index, 'interiorReviewListImage')}>
                                                    Удалить
                                                </Button>
                                            )}
                                        </Col>
                                    </Row>
                                ))}

                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                        Добавить характеристику
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    </Card>


                    {/* Безопасность (Safety) */}
                    <Col span={24}>
                        <Title level={3} style={{marginTop:20}}>Безопасность</Title>
                    </Col>
                    <Col span={24}>
                        <Card bordered={true} style={cardStyle}>

                            <Form.List name="safety">
                                {(fields, {add, remove}) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Row key={field.key} gutter={20}>
                                                <Col span={12}>
                                                    <FormInput
                                                        required={true}
                                                        required_text="Требуется заголовок безопасности Ru"
                                                        label={`Заголовок безопасности #${index + 1} (RU)`}
                                                        name={[field.name, "titleRu"]}
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <FormInput
                                                        required={true}
                                                        required_text="Требуется заголовок безопасности Uz"
                                                        label={`Заголовок безопасности #${index + 1} (UZ)`}
                                                        name={[field.name, "titleUz"]}
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <FormTextArea
                                                        required={true}
                                                        required_text="Требуется текст безопасности Ru"
                                                        label={`Текст безопасности #${index + 1} (RU)`}
                                                        name={[field.name, "textRu"]}
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <FormTextArea
                                                        required={true}
                                                        required_text="Требуется текст безопасности Uz"
                                                        label={`Текст безопасности #${index + 1} (UZ)`}
                                                        name={[field.name, "textUz"]}
                                                    />
                                                </Col>

                                                <Col span={24}>
                                                    {index > 0 && (
                                                        <Button type="danger" onClick={() => remove(field.name)}>
                                                            Удалить
                                                        </Button>
                                                    )}
                                                </Col>
                                            </Row>
                                        ))}

                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                                Добавить характеристику
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Card>
                    </Col>


                    {/* Test Drive */}
                    <Col span={12}>
                        <Form.Item
                            label={'Есть ли тест-драйв?'}
                            name={'isTestDrive'}
                            rules={[{
                                required: true, message: 'Вы должны выбрать'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите одну'
                                optionLabelProp='label'
                                options={optionsTestDrive}
                            />
                        </Form.Item>
                    </Col>

                    {/* Изображение Home */}
                    <Col span={12}>
                        <Form.Item
                            label="Изображение Home"
                            name="imageHome"
                            rules={[{required: true, message: "Требуется изображение Home"}]}
                        >
                            <Upload
                                maxCount={1}
                                fileList={fileListProps?.imageHome}
                                listType="picture-card"
                                onChange={(file) => onChangeImage(file, "imageHome")}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps?.imageHome?.length > 0 ? "" : "Upload"}
                            </Upload>
                        </Form.Item>
                    </Col>


                </Row>

                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editCarSuccess ? "Изменить" : "Создать"}
                </Button>
            </Form>

        }
    </div>);
};

export default CarPostEdit;