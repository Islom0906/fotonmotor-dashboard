import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    systemMode: localStorage.getItem('systemMode')||'light',
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        changeThemeMode:(state)=>{
            state.systemMode=state.systemMode==='light'? "dark":'light'
            localStorage.setItem('systemMode',state.systemMode)
        },
    },
})

export const {changeThemeMode} =themeSlice.actions
export default themeSlice.reducer