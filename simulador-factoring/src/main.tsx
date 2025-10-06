import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SimulationProvider } from './context/SimulationContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SimulationProvider>
        <App />
      </SimulationProvider>
    </BrowserRouter>
  </StrictMode>,
)
