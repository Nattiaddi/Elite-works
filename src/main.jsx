import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // እዚህ ጋር ስሙ ትክክል መሆኑን እይ
import './index.css' // ይህ ፋይል ከሌለህ ይሄን መስመር አጥፋው

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)