import { StrictMode, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import './index.css'
import App from './App.tsx'
import './auth/amplify'
import 'aws-amplify/auth/enable-oauth-listener'

function AppWrapper() {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
        },
      }),
    [],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
)
