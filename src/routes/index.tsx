import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import MultiStepSignup from '../pages/MultiStepSignup';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import MeuCadastro from '../pages/MeuCadastro';  // Import the component

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route 
        path="/login" 
        element={<Login />}
      />
      <Route 
        path="/cadastro" 
        element={<MultiStepSignup />}
      />
      <Route 
        path="/esqueci-a-senha" 
        element={<ForgotPasswordPage />}
      />
      <Route 
        path="/alterar-senha" 
        element={<ChangePasswordPage />}
      />

      {/* New route for Meu Cadastro */}
      <Route 
        path="/meu-cadastro" 
        element={
          <PrivateRoute>
            <MeuCadastro />
          </PrivateRoute>
        } 
      />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />

      {/* Optional: Add a default redirect */}
      <Route 
        path="*" 
        element={<Navigate to="/login" replace />} 
      />
    </Routes>
  );
}
