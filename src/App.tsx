import { BrowserRouter } from 'react-router-dom'
import { FinancialProvider } from './contexts/FinancialContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { AppRoutes } from './routes/AppRoutes'

// Componente raiz do aplicativo. Envolve toda a aplicação com os contextos globais e o roteamento.
function App() {
  return (
    <ThemeProvider>
      <FinancialProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </FinancialProvider>
    </ThemeProvider>
  )
}

export default App
