import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    editId:localStorage.getItem('editDataId')||""
}


export const querySlice = createSlice({
    name: 'query',
    initialState,
    reducers: {
        editIdQuery: (state, {payload}) => {
            state.editId = payload
        }
    }
})

export const {editIdQuery} = querySlice.actions
export default querySlice.reducer