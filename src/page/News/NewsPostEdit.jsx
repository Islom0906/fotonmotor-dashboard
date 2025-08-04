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
import {EditorState} from "draft-js";
import {convertFromHTML, convertToHTML} from "draft-convert";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import './news.scss'

const initialValueForm = {
    image: [],
    titleRu: "",
    titleUz: "",
    textRu: "",
    textUz: ""
};

const NewsPostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    const [fileListProps, setFileListProps] = useState([]);
    const [editorStatesUz, setEditorStatesUz] = useState(EditorState.createEmpty());
    const [editorStatesRu, setEditorStatesRu] = useState(EditorState.createEmpty());

    // query-news
    const {
        mutate: postNewsMutate,
        isLoading: postNewsLoading,
        isSuccess: postNewsSuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editNewsLoading,
        data: editNewsData,
        refetch: editNewsRefetch,
        isSuccess: editNewsSuccess
    } = useGetByIdQuery(false, "edit-news", editId, '/news/id')
    // put-query
    const {
        mutate: putNewsHome,
        isLoading: putNewsHomeLoading,
        isSuccess: putNewsHomeSuccess
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

    // news success
    SuccessCreateAndEdit(postNewsSuccess, putNewsHomeSuccess, '/news')
    // if edit news
    EditGetById(editNewsRefetch)
    // if no edit news
    SetInitialValue(form, initialValueForm)


    //edit news
    useEffect(() => {
        if (editNewsSuccess) {
            const initialEditorUz=EditorState.createWithContent(convertFromHTML(editNewsData.textUz))
            const initialEditorRu=EditorState.createWithContent(convertFromHTML(editNewsData.textRu))
            const image = [{
                uid: editNewsData?.image?._id,
                name: editNewsData?.image?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editNewsData.image.path}`
            }];


            const edit = {
                image,
                titleRu: editNewsData.titleRu,
                titleUz: editNewsData.titleUz,
                textRu: initialEditorRu,
                textUz: initialEditorUz,
            }

            setEditorStatesUz(initialEditorUz)
            setEditorStatesRu(initialEditorRu)
            setFileListProps(image)
            form.setFieldsValue(edit)
        }

    }, [editNewsData])

    const onFinish = (value) => {
        const itemsWithHtmlContentUz = convertToHTML(editorStatesUz.getCurrentContent());
        const itemsWithHtmlContentRu = convertToHTML(editorStatesRu.getCurrentContent());
        const data={
            titleRu: value.titleRu,
            titleUz: value.titleUz,
            textRu: itemsWithHtmlContentRu,
            textUz: itemsWithHtmlContentUz,
            image: fileListProps[0]?.uid

        }


        if (editNewsData) {
            putNewsHome({url: '/news', data, id: editId})
        } else {
            postNewsMutate({url: "/news", data});
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





    const onEditorStateChangeUz = (editorState) => {
        setEditorStatesUz(editorState);
    };
    const onEditorStateChangeRu = (editorState) => {
        setEditorStatesRu(editorState);
    };


    return (<div>
        {(postNewsLoading || editNewsLoading || putNewsHomeLoading) ?
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
                            required_text={'Необходимо ввести название новости Ru'}
                            label={'Название новости Ru'}
                            name={'titleRu'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Необходимо ввести название новости Uz'}
                            label={'Название новости Uz'}
                            name={'titleUz'}
                        />
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={`Основной текст Ru`}
                            name={"textRu"}
                            rules={[
                                {required: true, message: "Вам необходимо ввести основной текст"}
                            ]}
                            style={{width: "100%"}}
                        >
                            <Editor
                                editorState={editorStatesRu}
                                onEditorStateChange={(state) => onEditorStateChangeRu(state)}
                                editorClassName="editor-class"
                                toolbarClassName="toolbar-class"
                            />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={`Основной текст Uz`}
                            name={"textUz"}
                            rules={[
                                {required: true, message: "Вам необходимо ввести основной текст"}
                            ]}
                            style={{width: "100%"}}
                        >
                            <Editor
                                editorState={editorStatesUz}
                                onEditorStateChange={(state) => onEditorStateChangeUz(state)}
                                editorClassName="editor-class"
                                toolbarClassName="toolbar-class"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label='Изображение'
                            name={'image'}
                            rules={[{required: true, message: 'Требуется изображение'}]}>
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
                        </Form.Item>
                    </Col>

                </Row>


                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editNewsSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default NewsPostEdit;