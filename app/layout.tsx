'use client'
import '../src/styles/globals.css'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '../src/store/store'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

export default function RootLayout({ children }: { children: ReactNode }) {
  const theme = createTheme({
    palette: {
      mode: 'light', 
    },
  })

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  )
}
