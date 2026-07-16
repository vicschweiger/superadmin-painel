import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App.tsx' // Confirme se o caminho para o seu App.tsx está correto
import '../src/index.css' // Ou './index.css', dependendo do nome do seu arquivo de estilos globais

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)