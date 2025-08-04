import axios from "axios";

axios.defaults.baseURL=`${process.env.REACT_APP_API_URL}`

export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];

    }
};

export default axios
