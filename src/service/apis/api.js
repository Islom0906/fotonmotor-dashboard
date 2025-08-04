import axios from '../auth/axios'

const apiService = {
    // malutmotlarni get qilish uchun url beriladi
    // url / boshlansin yani /edu shunga oxshagan
    async getData(url) {
        const {data} = await axios.get(url);
        return data;
    },
    // faqat bitta malumot  get qilish uchun url va idsi beriladi
    // url / boshlansin yani /edu shunga oxshagan
    async getDataByID(url, id) {
        const {data} = await axios.get(`${url}/${id}`);
        return data;
    },
    // malutmotni post qilish uchun url va yaratilgan malumot beriladi
    // url / boshlansin yani /edu shunga oxshagan
    async postData(url, formData) {
        const {data}= await axios.post(url, formData);
        return data
    },
    // malutmotni edit qilish uchun url,id va yaratilgan malumot beriladi
    // url / boshlansin yani /edu shunga oxshagan
    async editData(url, formData, id) {

        if (id){
        const {data}= await axios.put(`${url}/${id}/`, formData)
        return data
        }else {
            const {data}= await axios.put(`${url}/`, formData)
            return data
        }
    },
    async editDataPatch(url, formData, id) {


        const {data} = await axios.patch(`${url}/${id}/`, formData)
        return data

    },
    // malutmotni delete qilish uchun url va id  beriladi
    // url / boshlansin yani /edu shunga oxshagan
    async deleteData(url, id) {
        await axios.delete(`${url}/${id}`);
    },

    async deleteImages(url, ids) {
        await axios.delete(url, {data:ids});
    },
};
export default apiService;