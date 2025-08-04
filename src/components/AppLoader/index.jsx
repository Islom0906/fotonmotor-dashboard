import './index.scss'
import {Spin, theme} from "antd";
const AppLoader = () => {
    const {
        token: {mainBg},
    } = theme.useToken();
    return (
        <div
            style={{
                background:mainBg
            }}
            className='app-loader'>
            <Spin/>
        </div>
    );
};

export default AppLoader;