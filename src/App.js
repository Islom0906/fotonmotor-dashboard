import AppLayout from "./AppLayout";
import {Provider} from 'react-redux'
import {store} from './store'
import AuthProvider from "./page/auth/AuthProvider/AuthProvider";
import {BrowserRouter as Router} from 'react-router-dom';

import {QueryClient, QueryClientProvider} from "react-query";
function App() {
  const queryCLient = new QueryClient()
    return (
        <QueryClientProvider client={queryCLient}>
        <Provider store={store}>
            <Router basename={'/admin'}>
                <AuthProvider>
                        <AppLayout/>
                </AuthProvider>
            </Router>
        </Provider>
        </QueryClientProvider>
    );
}
export default App;
