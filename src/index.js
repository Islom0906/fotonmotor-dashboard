import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css"
import {configDark, configLight} from "./constants/theme";
import {ConfigProvider, theme} from "antd";
import {useSelector} from "react-redux";

// const MainApp=()=>{
//     const {systemMode} = useSelector((state) => state.theme)
//     const {defaultAlgorithm, darkAlgorithm} = theme
//
//     return(
//         <ConfigProvider
//             theme={{
//                 algorithm: systemMode === 'dark' ? darkAlgorithm : defaultAlgorithm,
//                 token: systemMode === 'dark' ? configDark : configLight,
//             }}>
//             <App />
//         </ConfigProvider>
//     )
// }

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
   <App/>
  // </React.StrictMode>
);
