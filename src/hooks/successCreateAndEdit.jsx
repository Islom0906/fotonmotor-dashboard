import {useEffect} from "react";
import {editIdQuery} from "../store/slice/querySlice";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

const SuccessCreateAndEdit = (postSucess, putSuccess, link) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        if (putSuccess) {
            dispatch(editIdQuery(''))
        }

        if (postSucess || putSuccess) {
            navigate(link)
        }
    }, [postSucess, putSuccess])
};

export default SuccessCreateAndEdit;