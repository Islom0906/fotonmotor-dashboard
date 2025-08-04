import AppSidebar from "./AppSidebar";
import {ConfigProvider, Layout, theme} from "antd";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import './index.scss'
import AppPage from "./AppPage";
import {configDark, configLight} from "../constants/theme";
import {useSelector} from "react-redux";
import {Routes, Route} from 'react-router-dom';
import Login from "../page/auth/Login";
import AuthRoutes from "../page/auth/AuthRoutes";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from "dayjs";

dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.tz.setDefault('Asia/Tashkent');

const AppLayout = () => {
    const {systemMode} = useSelector((state) => state.theme)
    const {data: {isAuthenticated}} = useSelector(state => state.auth)

    const {defaultAlgorithm, darkAlgorithm} = theme
    return (
        <ConfigProvider
            theme={{
            algorithm: systemMode === 'dark' ? darkAlgorithm : defaultAlgorithm,
            token: systemMode === 'dark' ? configDark : configLight,
        }}>
            <AuthRoutes>
                {
                    !isAuthenticated ?
                        <Routes>
                            <Route path="/login" element={<Login/>}/>
                        </Routes>
                        :
                        <Layout>
                            <AppHeader/>
                            <Layout>
                                <AppSidebar/>
                                <Layout className={'ant--page'}>
                                    <AppPage/>
                                    <AppFooter/>
                                </Layout>
                            </Layout>
                        </Layout>
                }
            </AuthRoutes>
        </ConfigProvider>
    );
};

export default AppLayout;