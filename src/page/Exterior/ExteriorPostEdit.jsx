import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, Row, Select, Upload} from "antd";
import {AppLoader, FormInput, FormInputNumber} from "../../components";
import {useSelector} from "react-redux";
import {EditGetById, onPreviewImage, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import {
    useDeleteImagesQuery,
    useEditQuery,
    useGetByIdQuery,
    useGetQuery,
    usePostQuery
} from "../../service/query/Queries";


const initialValueForm = {
    colorNameRu: "",
    colorNameUz: "",
    carImage: "",
    colorImage: "",
    positionId: ""
}

const ExteriorPostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    const [fileListPropsCar, setFileListPropsCar] = useState([]);
    const [fileListPropsColor, setFileListPropsColor] = useState([]);
    const [isUpload, setIsUpload] = useState("")

    // query car
    const {data: positionData, refetch: positionFetch} = useGetQuery(false, 'get-position', '/position', false)


    // query-exterior
    const {
        mutate: postExteriorMutate,
        isLoading: postExteriorLoading,
        isSuccess: postExteriorSuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editExteriorLoading,
        data: editExteriorData,
        refetch: editExteriorRefetch,
        isSuccess: editExteriorSuccess
    } = useGetByIdQuery(false, "edit-exterior", editId, '/exterior')
    // put-query
    const {
        mutate: putExterior,
        isLoading: putExteriorLoading,
        isSuccess: putExteriorSuccess
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

    // exterior success
    SuccessCreateAndEdit(postExteriorSuccess, putExteriorSuccess, '/exterior')
    // if edit exterior
    EditGetById(editExteriorRefetch)
    // if no edit exterior
    SetInitialValue(form, initialValueForm)

    useEffect(() => {
        positionFetch()
    }, []);

    //edit exterior
    useEffect(() => {
        if (editExteriorSuccess) {

            const carImage = [{
                uid: editExteriorData?.carImage?._id,
                name: editExteriorData?.carImage?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editExteriorData?.carImage?.path}`
            }];
            const colorImage = [{
                uid: editExteriorData?.colorImage?._id,
                name: editExteriorData?.colorImage?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editExteriorData?.colorImage?.path}`
            }];

            const edit = {
                carImage,
                colorImage,
                colorNameRu: editExteriorData?.colorNameRu,
                colorNameUz: editExteriorData?.colorNameUz,
                positionId: editExteriorData?.positionId,
            }


            setFileListPropsCar(carImage)
            setFileListPropsColor(colorImage)
            form.setFieldsValue(edit)
        }

    }, [editExteriorData])

    const onFinish = (value) => {

        const data = {
            colorNameRu: value?.colorNameRu,
            colorNameUz: value?.colorNameUz,
            positionId: value?.positionId,
            carImage: fileListPropsCar[0]?.uid,
            colorImage: fileListPropsColor[0]?.uid,

        }


        if (editExteriorData) {
            putExterior({url: '/exterior', data, id: editId})
        } else {
            postExteriorMutate({url: "/exterior", data});
        }


    }


    // refresh page again get data
    useEffect(() => {
        const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        if (storedValues) {
            setFileListPropsCar(storedValues.carImage)
            setFileListPropsColor(storedValues.colorImage)
            form.setFieldsValue(storedValues);
        }

        const handleBeforeUnload = () => {

            localStorage.setItem(
                'myFormValues',
                JSON.stringify(form.getFieldsValue()),
            );
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            localStorage.removeItem('editDataId')
            localStorage.removeItem('myFormValues')
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);

    // image
    useEffect(() => {
        // car
        if (imagesUploadSuccess && isUpload === 'car') {
            const initialImage = [...fileListPropsCar]
            const uploadImg = {
                uid: imagesUpload[0]?._id,
                name: imagesUpload[0]?._id,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${imagesUpload[0]?.path}`
            }
            initialImage.push(uploadImg)
            form.setFieldsValue({carImage: [uploadImg]});
            setFileListPropsCar(initialImage);
            setIsUpload("")
        }
        // color image
        if (imagesUploadSuccess && isUpload === "color") {
            const initialImage = [...fileListPropsColor]
            const uploadImg = {
                uid: imagesUpload[0]?._id,
                name: imagesUpload[0]?._id,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${imagesUpload[0]?.path}`
            }
            initialImage.push(uploadImg)
            form.setFieldsValue({colorImage: [uploadImg]});
            setFileListPropsColor(initialImage);
            setIsUpload("")
        }
    }, [imagesUpload]);

    const onChangeImageCar = ({fileList: newFileList}) => {
        const formData = new FormData();
        if (fileListPropsCar.length !== 0 || newFileList.length === 0) {
            form.setFieldsValue({bannerWeb: []});
            const id = {
                ids: [fileListPropsCar[0]?.uid]
            };

            imagesDeleteMutate({url: "/medias", id});
            setFileListPropsCar([])
        } else if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({url: "/medias", data: formData});
            setIsUpload("car")
        }

    };


    // color image
    const onChangeImageColor = ({fileList: newFileList}) => {
        const formData = new FormData();
        if (fileListPropsColor.length !== 0 || newFileList.length === 0) {
            form.setFieldsValue({bannerRes: []});
            const id = {
                ids: [fileListPropsColor[0]?.uid]
            };
            imagesDeleteMutate({url: "/medias", id});
            setFileListPropsColor([])
        } else if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({url: "/medias", data: formData});
            setIsUpload("color")
        }

    };

    // option
    const optionsPosition = useMemo(() => {
        return positionData?.map((option) => {
            return {
                value: option?._id,
                label: `${option?.titleRu} - (${option?.carId?.name})`,
            };
        });
    }, [positionData]);

    return (<div>
        {(postExteriorLoading || editExteriorLoading || putExteriorLoading) ?
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
                <Row gutter={16}>
                    {/* Color Name Fields */}
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Пожалуйста, введите название цвета на русском языке!'}
                            label="Название цвета (Русский)"
                            name="colorNameRu"
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Пожалуйста, введите название цвета на узбекском языке!'}
                            label="Название цвета (Узбекский)"
                            name="colorNameUz"
                        />
                    </Col>
                </Row>

                <Row gutter={16}>


                    {/* Position ID Field */}
                    <Col span={12}>
                        <Form.Item
                            label={'Выбор позиция'}
                            name={'positionId'}
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
                                placeholder='Выберите одну категория'
                                optionLabelProp='label'
                                options={optionsPosition}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    {/* Car Image Upload */}
                    <Col span={12}>
                        <Form.Item
                            label="Изображение машины"
                            name="carImage"
                            rules={[{required: true, message: 'Пожалуйста, загрузите изображение машины!'}]}>
                            {/*<ImgCrop>*/}
                            <Upload
                                maxCount={1}
                                fileList={fileListPropsCar}
                                listType='picture-card'
                                onChange={onChangeImageCar}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListPropsCar.length > 0 ? "" : "Upload"}
                            </Upload>
                            {/*</ImgCrop>*/}
                        </Form.Item>

                    </Col>

                    {/* Color Image Upload */}
                    <Col span={12}>
                        <Form.Item
                            label="Изображение цвета"
                            name="colorImage"
                            rules={[{required: true, message: 'Пожалуйста, загрузите изображение цвета!'}]}>
                            {/*<ImgCrop>*/}
                            <Upload
                                maxCount={1}
                                fileList={fileListPropsColor}
                                listType='picture-card'
                                onChange={onChangeImageColor}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListPropsColor.length > 0 ? "" : "Upload"}
                            </Upload>
                            {/*</ImgCrop>*/}
                        </Form.Item>

                    </Col>
                </Row>


                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editExteriorSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default ExteriorPostEdit;