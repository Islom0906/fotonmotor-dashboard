import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Row, Upload} from "antd";
import {AppLoader, FormInput} from "../../components";
import {useSelector} from "react-redux";
import {EditGetById, onPreviewImage, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import {
    useDeleteImagesQuery,
    useEditQuery,
    useGetByIdQuery,
    usePostQuery
} from "../../service/query/Queries";


const initialValueForm = {
    image: [],
    nameRu: "",
    nameUz: ""
};

const CategoryPostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    const [fileListProps, setFileListProps] = useState([]);
    // query-category
    const {
        mutate: postCategoryMutate,
        isLoading: postCategoryLoading,
        isSuccess: postCategorySuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editCategoryLoading,
        data: editCategoryData,
        refetch: editCategoryRefetch,
        isSuccess: editCategorySuccess
    } = useGetByIdQuery(false, "edit-category", editId, '/category')
    // put-query
    const {
        mutate: putCategoryHome,
        isLoading: putCategoryHomeLoading,
        isSuccess: putCategoryHomeSuccess
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

    // category success
    SuccessCreateAndEdit(postCategorySuccess, putCategoryHomeSuccess, '/category')
    // if edit category
    EditGetById(editCategoryRefetch)
    // if no edit category
    SetInitialValue(form, initialValueForm)


    //edit category
    useEffect(() => {
        if (editCategorySuccess) {

            const image = [{
                uid: editCategoryData?.image?._id,
                name: editCategoryData?.image?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editCategoryData.image.path}`
            }];


            const edit = {
                image,
                nameRu: editCategoryData?.nameRu,
                nameUz: editCategoryData?.nameUz
            }


            setFileListProps(image)
            form.setFieldsValue(edit)
        }

    }, [editCategoryData])

    const onFinish = (value) => {

        const data={
            nameRu:value?.nameRu,
            nameUz:value?.nameUz,
            image: fileListProps[0]?.uid

        }


        if (editCategoryData) {
            putCategoryHome({url: '/category', data, id: editId})
        } else {
            postCategoryMutate({url: "/category", data});
        }


    }


    // refresh page again get data
    useEffect(() => {
        const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        if (storedValues) {
            setFileListProps(storedValues.image)
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
        // images
        if (imagesUploadSuccess) {
            const initialImage = [...fileListProps]
            const uploadImg = {
                uid: imagesUpload[0]?._id,
                name: imagesUpload[0]?._id,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${imagesUpload[0]?.path}`
            }
            initialImage.push(uploadImg)
            form.setFieldsValue({image: [uploadImg]});
            setFileListProps(initialImage);
        }

    }, [imagesUpload]);

    const onChangeImage = ({fileList: newFileList}) => {
        const formData = new FormData();
        if (fileListProps.length !== 0 || newFileList.length === 0) {
            form.setFieldsValue({image: []});
            const id = {
                ids:[fileListProps[0]?.uid]
            };

            imagesDeleteMutate({url: "/medias", id});
            setFileListProps([])
        } else if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({url: "/medias", data: formData});
        }

    };








    return (<div>
        {(postCategoryLoading || editCategoryLoading || putCategoryHomeLoading) ?
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
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Необходимо ввести название категории Ru'}
                            label={'Название категории Ru'}
                            name={'nameRu'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Необходимо ввести название категории Uz'}
                            label={'Название категории Uz'}
                            name={'nameUz'}
                        />
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label='Изображение'
                            name={'image'}
                            rules={[{required: true, message: 'Требуется изображение'}]}>
                            {/*<ImgCrop>*/}
                            <Upload
                                maxCount={1}
                                fileList={fileListProps}
                                listType='picture-card'
                                onChange={onChangeImage}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps.length > 0 ? "" : "Upload"}
                            </Upload>
                            {/*</ImgCrop>*/}
                        </Form.Item>
                    </Col>

                </Row>


                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editCategorySuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default CategoryPostEdit;