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
    video:[],
    powerReserve:"",
    peakPower:"",
    acceleration:"",
    car:""
}

const BannerHomePostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    const [fileListProps, setFileListProps] = useState([]);
    // get car
    const {data: carData, refetch: carFetch} = useGetQuery(false, 'get-car', '/car', false)
    // query-banner
    const {
        mutate: postBannerHomeMutate,
        isLoading: postBannerHomeLoading,
        isSuccess: postBannerHomeSuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editBannerHomeLoading,
        data: editBannerHomeData,
        refetch: editBannerHomeRefetch,
        isSuccess: editBannerHomeSuccess
    } = useGetByIdQuery(false, "edit-banner", editId, '/banner')
    // put-query
    const {
        mutate: putBannerHome,
        isLoading: putBannerHomeLoading,
        isSuccess: putBannerHomeSuccess
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

    // banner success
    SuccessCreateAndEdit(postBannerHomeSuccess, putBannerHomeSuccess, '/banner')
    // if edit banner
    EditGetById(editBannerHomeRefetch)
    // if no edit banner
    SetInitialValue(form, initialValueForm)

    useEffect(() => {
        carFetch()
    }, []);
    //edit banner
    useEffect(() => {
        if (editBannerHomeSuccess) {

            const video = [{
                uid: editBannerHomeData?.video?._id,
                name: editBannerHomeData?.video?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editBannerHomeData?.video?.path}`
            }];



            const edit = {
                video: video,
                powerReserve: editBannerHomeData?.powerReserve,
                peakPower: editBannerHomeData?.peakPower,
                acceleration: editBannerHomeData?.acceleration,
                car: editBannerHomeData?.car?._id
            }
            console.log(edit)


            setFileListProps(video)

            form.setFieldsValue(edit)
        }

    }, [editBannerHomeData])

    const onFinish = (value) => {

        const data={
           ...value,
            video:  fileListProps[0]?.uid
        }


        if (editBannerHomeData) {
            putBannerHome({url: '/banner', data, id: editId})
        } else {
            postBannerHomeMutate({url: "/banner", data});
        }


    }


    // refresh page again get data
    useEffect(() => {
        const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        if (storedValues) {
            setFileListProps(storedValues.video)
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

        // video
        if (imagesUploadSuccess ) {
            const initialImage = [...fileListProps]
            const uploadImg = {
                uid: imagesUpload[0]?._id,
                name: imagesUpload[0]?._id,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${imagesUpload[0]?.path}`
            }
            initialImage.push(uploadImg)
            form.setFieldsValue({video: [uploadImg]});
            setFileListProps(initialImage);
        }
    }, [imagesUpload]);









    // res image
    const onChangeImageVideo = ({fileList: newFileList}) => {
        const formData = new FormData();
        if (fileListProps.length !== 0 || newFileList.length === 0) {
            form.setFieldsValue({video: []});
            const id = {
                ids: [fileListProps[0]?.uid]
            };
            imagesDeleteMutate({url: "/medias", id});
            setFileListProps([])
        } else if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({url: "/medias", data: formData});
        }

    };



// option
    const optionsCar = useMemo(() => {
        return carData?.map((option) => {
            return {
                value: option?._id,
                label: option?.name,
            };
        });
    }, [carData]);



    return (<div>
        {(postBannerHomeLoading || editBannerHomeLoading || putBannerHomeLoading) ?
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
                            required_text={'Требуется'}
                            label={'Резерв мощности'}
                            name={'powerReserve'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется'}
                            label={'Пиковая мощность'}
                            name={'peakPower'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется'}
                            label={'Ускорение'}
                            name={'acceleration'}
                        />
                    </Col>
                    <Col span={12}>

                        <Form.Item
                            label={'машина'}
                            name={'car'}
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
                                placeholder='Выберите одну машина'
                                optionLabelProp='label'
                                options={optionsCar}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Видео'
                            name={'video'}
                            rules={[{required: true, message: 'Требуется видео'}]}>
                            {/*<ImgCrop>*/}
                            <Upload
                                maxCount={1}
                                fileList={fileListProps}
                                listType='picture-card'
                                onChange={onChangeImageVideo}
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
                    {editBannerHomeSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default BannerHomePostEdit;