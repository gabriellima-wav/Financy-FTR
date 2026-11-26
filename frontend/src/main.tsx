import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@fontsource-variable/inter'
import './styles.css'
import { App } from './App'
import { Toaster } from './components/ui/toast'
const cache = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: true } },
})
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={cache}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>,
)
