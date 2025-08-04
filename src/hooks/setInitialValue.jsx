import {useEffect} from "react";
import {useSelector} from "react-redux";

const SetInitialValue = (form,initialValueForm) => {
    const {editId} = useSelector(state => state.query)

    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
    }, []);
};

export default SetInitialValue;