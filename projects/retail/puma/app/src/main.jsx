import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// tldraw crashes under StrictMode (double mount/unmount)
const isReview = window.location.pathname === '/review'
const Wrapper = isReview ? ({ children }) => children : StrictMode

createRoot(document.getElementById('root')).render(
  <Wrapper>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Wrapper>,
)
