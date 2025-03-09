import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "react-day-picker/style.css";  // import it first so defualt style given by it gets override by our defined styles
import './index.css' // import at last as we want our styles to override the default ones
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
