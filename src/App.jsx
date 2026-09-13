import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import { ProtectedRoute } from './ProtectedRoute'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { PropertyList } from './pages/PropertyList'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/properties"
          element={
            <ProtectedRoute>
              <PropertyList />
            </ProtectedRoute>
          }
        />
        {/* ルート未指定時は物件一覧へ(未ログインならログイン画面へリダイレクトされる) */}
        <Route path="/" element={<Navigate to="/properties" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
