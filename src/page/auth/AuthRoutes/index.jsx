import {useSelector} from "react-redux";
import {AppLoader} from "../../../components";

const AuthRoutes = ({children}) => {
    const {data:{isLoading}}=useSelector(state => state.auth)
    return isLoading ? <AppLoader/> : <>{children}</>
};

export default AuthRoutes;