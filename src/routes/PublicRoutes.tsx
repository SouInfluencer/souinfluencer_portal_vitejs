import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import MultiStepSignup from '../pages/MultiStepSignup';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import {NotificationProvider} from "../components/ui/NotificationProvider.tsx";

export function PublicRoutes() {
  return (
      <NotificationProvider>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<MultiStepSignup />} />
      <Route path="/esqueci-a-senha" element={<ForgotPasswordPage />} />
      <Route path="/alterar-senha" element={<ChangePasswordPage />} />
      
      {/* Redirect to login for any unmatched public routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
      </NotificationProvider>
  );
}
