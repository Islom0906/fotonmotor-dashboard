import React, {useEffect, useMemo} from 'react';
import {Button, Card, Col, Form, Row, Select} from "antd";
import {AppLoader, FormInput} from "../../components";
import {useSelector} from "react-redux";
import {EditGetById, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import {useEditQuery, useGetByIdQuery, useGetQuery, usePostQuery} from "../../service/query/Queries";
import {LuMinusCircle} from "react-icons/lu";

const cardStye = {border: 1, borderStyle: "dashed", borderColor: "black"}

const initialValueForm = {
    titleRu: "",
    titleUz: "",
    list: [
        {
            titleRu: "",
            titleUz: ""
        }
    ],
    carId: ""
}

const CategoryPostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    // query car
    const {data: carData, refetch: carFetch} = useGetQuery(false, 'get-car', '/car', false)

    // query-position
    const {
        mutate: postPositionMutate,
        isLoading: postPositionLoading,
        isSuccess: postPositionSuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editPositionLoading,
        data: editPositionData,
        refetch: editPositionRefetch,
        isSuccess: editPositionSuccess
    } = useGetByIdQuery(false, "edit-position", editId, '/position')
    // put-query
    const {
        mutate: putPositionHome,
        isLoading: putPositionHomeLoading,
        isSuccess: putPositionHomeSuccess
    } = useEditQuery()


    // ================================ useEffect =============================

    // position success
    SuccessCreateAndEdit(postPositionSuccess, putPositionHomeSuccess, '/position')
    // if edit position
    EditGetById(editPositionRefetch)
    // if no edit position
    SetInitialValue(form, initialValueForm)

    useEffect(() => {
        carFetch()
    }, []);

    //edit position
    useEffect(() => {
        if (editPositionSuccess) {
            const listCopy=editPositionData.list.map(list=>(
                {
                    titleRu: list.titleRu,
                    titleUz: list.titleUz
                }
            ))
            console.log(listCopy)
            const edit = {
                titleRu: editPositionData.titleRu,
                titleUz: editPositionData.titleUz,
                list: listCopy,
                carId: editPositionData.carId
            }


            form.setFieldsValue(edit)
        }

    }, [editPositionData])

    const onFinish = (value) => {


        if (editPositionData) {
            putPositionHome({url: '/position', data: value, id: editId})
        } else {
            postPositionMutate({url: "/position", data: value});
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
    const optionsCar = useMemo(() => {
        return carData?.map((option) => {
            return {
                value: option?._id,
                label: option?.name,
            };
        });
    }, [carData]);


    return (<div>
        {(postPositionLoading || editPositionLoading || putPositionHomeLoading) ?
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
                    {/* Car Title Fields */}
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Пожалуйста, введите название на русском языке'}
                            label={'Title (Ru)'}
                            name={'titleRu'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Iltimos sarlavhani o\'zbekcha kiriting'}
                            label="Title (Uz)"
                            name="titleUz"
                        />
                    </Col>
                </Row>

                <Row gutter={16}>

                    {/* Car ID Field */}
                    <Col span={12}>
                        <Form.Item
                            label={'Выбор автомобиля'}
                            name={'carId'}
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
                                options={optionsCar}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* List Item */}
                <Card bordered={true} style={cardStye}>
                    <Form.List name="list">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map((field) => (
                                    <Row gutter={16} key={field.key}>
                                        <Col span={12}>
                                            <FormInput
                                                required={true}
                                                required_text={'Введите название списка на русском языке.'}
                                                label="List Title (Russian)"
                                                name={[field.name, 'titleRu']}

                                            />

                                        </Col>
                                        <Col span={12}>
                                            <FormInput
                                                required={true}
                                                required_text={'Iltimos, ro\'yxat sarlavhasini rus tilida kiriting'}
                                                label="List Title (Uzbek)"
                                                name={[field.name, 'titleUz']}

                                            />

                                        </Col>
                                        <Col span={24}>
                                            <Button type="danger" onClick={() => remove(field.name)}>
                                                <LuMinusCircle/> Remove List Item
                                            </Button>
                                        </Col>
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


                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editPositionSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default CategoryPostEdit;