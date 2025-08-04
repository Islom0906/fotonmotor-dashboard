


import React, {useEffect, useMemo} from 'react';
import {Button, Col, Form, Row, Select} from "antd";
import {AppLoader, FormInput} from "../../components";
import {useSelector} from "react-redux";
import {EditGetById,  SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import { useEditQuery, useGetByIdQuery, usePostQuery} from "../../service/query/Queries";


const initialValueForm = {
    name: "",
    tgId: "",
    role: ""
};

const CategoryPostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    // query-tg-bot
    const {
        mutate: postTgBotMutate,
        isLoading: postTgBotLoading,
        isSuccess: postTgBotSuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editTgBotLoading,
        data: editTgBotData,
        refetch: editTgBotRefetch,
        isSuccess: editTgBotSuccess
    } = useGetByIdQuery(false, "edit-tg-bot", editId, '/tgBot')
    // put-query
    const {
        mutate: putTgBotHome,
        isLoading: putTgBotHomeLoading,
        isSuccess: putTgBotHomeSuccess
    } = useEditQuery()


    // ================================ useEffect =============================

    // tg-bot success
    SuccessCreateAndEdit(postTgBotSuccess, putTgBotHomeSuccess, '/tg-bot')
    // if edit tg-bot
    EditGetById(editTgBotRefetch)
    // if no edit tg-bot
    SetInitialValue(form, initialValueForm)


    //edit tg-bot
    useEffect(() => {
        if (editTgBotSuccess) {




            const edit = {
                name: editTgBotData?.name,
                tgId: editTgBotData?.tgId,
                role: editTgBotData?.role
            }


            form.setFieldsValue(edit)
        }

    }, [editTgBotData])

    const onFinish = (value) => {

        const data = {
            name: value?.name,
            tgId: value?.tgId,
            role: value?.role,

        }


        if (editTgBotData) {
            putTgBotHome({url: '/tgBot', data, id: editId})
        } else {
            postTgBotMutate({url: "/tgBot", data});
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

    // option
    const optionsRole = useMemo(() => {

        return [
            {
                value: "all",
                label: "Все роли",
            },
            {
                value: "drive",
                label: "Тест-драйв",
            },
            {
                value: "dealer",
                label: "Дилер",
            },
            {
                value: "order",
                label: "Заказ",
            },
            {
                value: "questions",
                label: "Вопросы",
            },
            {
                value: "service",
                label: "Сервисе",
            },
        ]


    }, []);



    return (<div>
        {(postTgBotLoading || editTgBotLoading || putTgBotHomeLoading) ?
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
                            required_text={'Необходимо ввести имя пользователя'}
                            label={'Имя пользователя'}
                            name={'name'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Telegram ID необходимо ввести'}
                            label={'Telegram ID'}
                            name={'tgId'}
                        />
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label={'Выберите роль'}
                            name={'role'}
                            rules={[{
                                required: true, message: 'Вам нужно выбрать роль'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите одну роль'
                                optionLabelProp='label'
                                options={optionsRole}
                            />
                        </Form.Item>
                    </Col>
                </Row>


                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editTgBotSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default CategoryPostEdit;