import React, {useEffect} from 'react';
import {Button, Card, Col, Form, Row} from "antd";
import {AppLoader, FormInput, FormInputNumber} from "../../components";
import {useSelector} from "react-redux";
import {EditGetById, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import {useEditQuery, useGetByIdQuery, usePostQuery} from "../../service/query/Queries";
import {LuMinusCircle} from "react-icons/lu";

const cardStye = {border: 1, borderStyle: "dashed", borderColor: "black"}

const initialValueForm = {
    facebook: "",
    telegram: "",
    instagram: "",
    youtube: "",
    tel: [
        ""
    ],
    addressRu: "",
    addressUz: "",
    location: ""
}

const ContactPostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    // query-contact-home
    const {
        mutate: postContactMutate,
        isLoading: postContactLoading,
        isSuccess: postContactSuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editContactLoading,
        data: editContactData,
        refetch: editContactRefetch,
        isSuccess: editContactSuccess
    } = useGetByIdQuery(false, "edit-contact", editId, '/contact')
    // put-query
    const {
        mutate: putContactHome,
        isLoading: putContactHomeLoading,
        isSuccess: putContactHomeSuccess
    } = useEditQuery()


    // ================================ useEffect =============================

    // contact-home success
    SuccessCreateAndEdit(postContactSuccess, putContactHomeSuccess, '/contact')
    // if edit contact-home
    EditGetById(editContactRefetch)
    // if no edit contact-home
    SetInitialValue(form, initialValueForm)


    //edit contact-home
    useEffect(() => {
        if (editContactSuccess) {

        const telNumber=editContactData.tel.map(item=>Number(item))

            const edit = {
                tel: telNumber,
                addressRu: editContactData?.addressRu,
                addressUz: editContactData?.addressUz,
                location: editContactData?.location,
                instagram: editContactData.instagram.split('//')[1],
                youtube: editContactData.youtube.split('//')[1],
                facebook: editContactData.facebook.split('//')[1],
                telegram: editContactData.telegram.split('//')[1],
            }


            form.setFieldsValue(edit)
        }

    }, [editContactData])

    const onFinish = (value) => {
        const telString=value.tel.map(item=>`${item}`)
        const data={
            tel:telString,
            instagram:`https://${value.instagram}`,
            youtube:`https://${value.youtube}`,
            facebook:`https://${value.facebook}`,
            telegram:`https://${value.telegram}`,
            addressRu:value.addressRu,
            addressUz:value.addressUz,
            location:value.location
        }


        if (editContactData) {
            putContactHome({url: '/contact', data, id: editId})
        } else {
            postContactMutate({url: "/contact", data});
        }


    }


    // refresh page again get data
    useEffect(() => {
        const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        if (storedValues) {
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










    return (<div>
        {(postContactLoading || editContactLoading || putContactHomeLoading) ?
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
                            addonBefore={'https://'}

                            required_text={'Необходимо ввести учетную запись Facebook'}
                            label={'Аккаунт в Фэйсбуке'}
                            name={'facebook'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Необходимо ввести учетную запись Youtube'}
                            label={'Аккаунт в Youtube'}
                            name={'youtube'}
                            addonBefore={'https://'}

                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Необходимо ввести учетную запись Instagram'}
                            label={'Аккаунт в Instagram'}
                            name={'instagram'}
                            addonBefore={'https://'}

                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Необходимо ввести учетную запись Telegram'}
                            label={'Аккаунт в Telegram'}
                            name={'telegram'}
                            addonBefore={'https://'}

                        />
                    </Col>
                    <Col span={24}>
                        <FormInput
                            required={true}
                            required_text={'Необходимо ввести ссылку на местоположение на карте.'}
                            label={'Ссылка на местоположение на карте'}
                            name={'location'}


                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Необходимо ввести адрес'}
                            label={'Введите адрес Ru'}
                            name={'addressRu'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Необходимо ввести адрес'}
                            label={'Введите адрес Uz'}
                            name={'addressUz'}
                        />
                    </Col>
                    <Col span={24}>

                    <Card bordered={true} style={cardStye}>
                        <Form.List name="tel">
                            {(fields, {add, remove}) => (
                                <>
                                    {fields.map((field,index) => (
                                        <Row gutter={16} key={field.key}>
                                            <Col span={24}>
                                                <FormInputNumber
                                                    required={true}
                                                    required_text={'Номер телефона вводить не обязательно'}
                                                    label="Введите номер телефона"
                                                    name={[field.name]}

                                                />

                                            </Col>
                                            {
                                                index> 0 && <Col span={24}>
                                                    <Button type="danger" onClick={() => remove(field.name)}>
                                                        <LuMinusCircle/> Remove List Item
                                                    </Button>
                                                </Col>
                                            }
                                        </Row>
                                    ))}

                                    <Form.Item>
                                        <Button type="dashed" block onClick={() => add()}>
                                            Add List Item
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Card>
                    </Col>

                </Row>


                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editContactSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default ContactPostEdit;