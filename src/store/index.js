import {configureStore} from '@reduxjs/toolkit'
import themeSlice from "./slice/themeSlice";
import authSlice from './slice/authSlice'
import querySlice from "./slice/querySlice";

export const store = configureStore({
    reducer: {
        theme: themeSlice,
        auth: authSlice,
        query:querySlice
    },
})