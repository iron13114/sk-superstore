import './i18n'; 
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StyledEngineProvider } from '@mui/material/styles';
import './index.css';
import {Provider} from 'react-redux'
import { store } from './app/store';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
      light: '#4b5563',
      contrastText: '#ffffff',
    },
  },
})

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <Provider store={store}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                      <GoogleOAuthProvider clientId={CLIENT_ID}>
                          <App />
                      </GoogleOAuthProvider>
                    </ThemeProvider>
            </StyledEngineProvider>
        </Provider>
  </React.StrictMode>
);

