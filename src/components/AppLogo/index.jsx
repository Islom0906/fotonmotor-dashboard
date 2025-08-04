import './index.scss'
import {useSelector} from "react-redux";
const AppLogo = () => {
    const {systemMode} = useSelector(state => state.theme)
    return (
        <div className={'app-logo'}>

            {
                systemMode === 'dark' ?
                    <img src={'/admin/logo.png'} alt="logo-dark"/>
                    :
                    <img src={'/admin/logo.png'} alt="logo-light"/>
            }
        </div>
    );
};

export default AppLogo;