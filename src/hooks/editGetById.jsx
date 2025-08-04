import {useEffect} from "react";
import {useSelector} from "react-redux";

const EditGetById = (getByIdRefetch) => {
    const {editId} = useSelector(state => state.query)

    useEffect(() => {
        if (editId !== "") {
            getByIdRefetch();
        }
    }, [editId]);
};

export default EditGetById;