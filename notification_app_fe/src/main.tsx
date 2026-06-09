import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1d4ed8'
    },
    background: {
      default: '#f8fafc'
    }
  },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'].join(',')
  },
  shape: {
    borderRadius: 12
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
