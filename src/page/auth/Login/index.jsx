import {Button, Form, Input, message, theme} from "antd";
import {setAuthToken} from "../../../service/auth/axios";
import {useDispatch} from "react-redux";
import {authData} from "../../../store/slice/authSlice";
import apiService from "../../../service/apis/api";
import './index.scss'
import {AppLogo} from "../../../components";
import BackgroundContent from "../../../AppLayout/AppPage/BackgrountContent";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const {
        token: {mainBg},
    } = theme.useToken();

    const onFinish = async (values) => {
        if (localStorage.getItem('token')) {
            localStorage.removeItem('refToken')
        }
        try {
            const data = await apiService.postData('/auth', values)
            localStorage.setItem('token', data?.token)
            // localStorage.setItem('refToken', data?.refresh)
            setAuthToken(data.token)

            const userInfo = await apiService.getData('/user/me')
            dispatch(authData({
                user: userInfo,
                isLoading: false,
                isAuthenticated: true,
            }))
            navigate('/')
            message.success('Успешно')
        } catch (error) {
            message.error(error?.response?.data?.detail)
            dispatch(authData({
                user: null,
                isLoading: false,
                isAuthenticated: false,
            }))
        }

    };


    return (
        <div
            style={{
                background: mainBg,
            }}
            className={'login--page'}>

            <BackgroundContent
            >
                <div className={'login-card'}>

                <div className={'logo-login'}>
                    <AppLogo/>
                </div>
                <Form
                    name="basic"
                    labelCol={{
                        span: 24,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                    style={{
                        maxWidth: 600,
                    }}

                    initialValues={{
                        email: '',
                        password: ''
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Электронная почта"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please put your email!',
                            },
                        ]}
                    >
                        <Input placeholder={'Введите адрес электронной почты'}/>
                    </Form.Item>

                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please put your password!',
                            },
                        ]}
                    >
                        <Input.Password placeholder={'Напишите свой пароль'}/>
                    </Form.Item>


                    <Form.Item
                        wrapperCol={{
                            span: 24,
                        }}
                    >
                        <Button type="primary" htmlType="submit" style={{width:'100%'}}>
                            Вход
                        </Button>
                    </Form.Item>
                </Form>
                </div>

            </BackgroundContent>
        </div>

    );
};

export default Login;