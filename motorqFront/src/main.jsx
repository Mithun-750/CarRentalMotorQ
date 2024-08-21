import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppwithContext } from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AppwithContext />
  </StrictMode>,
)
