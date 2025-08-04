import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, Row, Select, Upload} from "antd";
import {AppLoader, FormInput} from "../../components";
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
    exteriorId: ""
}

const InteriorPostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    const [fileListPropsCar, setFileListPropsCar] = useState([]);
    const [fileListPropsColor, setFileListPropsColor] = useState([]);
    const [isUpload, setIsUpload] = useState("")

    // query car
    const {data: exteriorData, refetch: exteriorFetch} = useGetQuery(false, 'get-exterior', '/exterior', false)


    // query-interior
    const {
        mutate: postInteriorMutate,
        isLoading: postInteriorLoading,
        isSuccess: postInteriorSuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editInteriorLoading,
        data: editInteriorData,
        refetch: editInteriorRefetch,
        isSuccess: editInteriorSuccess
    } = useGetByIdQuery(false, "edit-interior", editId, '/interior')
    // put-query
    const {
        mutate: putInterior,
        isLoading: putInteriorLoading,
        isSuccess: putInteriorSuccess
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

    // interior success
    SuccessCreateAndEdit(postInteriorSuccess, putInteriorSuccess, '/interior')
    // if edit interior
    EditGetById(editInteriorRefetch)
    // if no edit interior
    SetInitialValue(form, initialValueForm)

    useEffect(() => {
        exteriorFetch()
    }, []);

    //edit exterior
    useEffect(() => {
        if (editInteriorSuccess) {

            const carImage = [{
                uid: editInteriorData?.carImage?._id,
                name: editInteriorData?.carImage?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editInteriorData?.carImage?.path}`
            }];
            const colorImage = [{
                uid: editInteriorData?.colorImage?._id,
                name: editInteriorData?.colorImage?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editInteriorData?.colorImage?.path}`
            }];

            const edit = {
                carImage,
                colorImage,
                colorNameRu: editInteriorData?.colorNameRu,
                colorNameUz: editInteriorData?.colorNameUz,
                exteriorId: editInteriorData?.exteriorId,
            }


            setFileListPropsCar(carImage)
            setFileListPropsColor(colorImage)
            form.setFieldsValue(edit)
        }

    }, [editInteriorData])

    const onFinish = (value) => {

        const data = {
            colorNameRu: value?.colorNameRu,
            colorNameUz: value?.colorNameUz,
            exteriorId: value?.exteriorId,
            carImage: fileListPropsCar[0]?.uid,
            colorImage: fileListPropsColor[0]?.uid,

        }


        if (editInteriorData) {
            putInterior({url: '/interior', data, id: editId})
        } else {
            postInteriorMutate({url: "/interior", data});
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
    const optionsExterior = useMemo(() => {
        return exteriorData?.map((option) => {
            return {
                value: option?._id,
                label: `${option?.colorNameRu} - ${option?.positionId ? option?.positionId?.titleRu:""}`,
            };
        });
    }, [exteriorData]);

    return (<div>
        {(postInteriorLoading || editInteriorLoading || putInteriorLoading) ?
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
                            label={'Выбор внешний вид'}
                            name={'exteriorId'}
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
                                options={optionsExterior}
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
                    {editInteriorSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default InteriorPostEdit;