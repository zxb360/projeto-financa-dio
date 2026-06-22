import { BrowserRouter } from 'react-router-dom'
import { FinancialProvider } from './contexts/FinancialContext'
import { AppRoutes } from './routes/AppRoutes'

// Componente raiz do aplicativo. Envolve toda a aplicação com o contexto financeiro e o roteamento.
function App() {
  return (
    <FinancialProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </FinancialProvider>
  )
}

export default App
