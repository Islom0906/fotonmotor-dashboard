import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    data: {
        user: null,
        isLoading: false,
        isAuthenticated: false,
    }
}


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authData: (state, {payload}) => {
            state.data = payload
        }
    }
})

export const {authData} = authSlice.actions
export default authSlice.reducer