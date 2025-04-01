import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, CheckCircle, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AuthService } from '../services/authService';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [status, setStatus] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Extract token from URL
        const urlToken = AuthService.extractTokenFromURL();

        if (!urlToken) {
          setStatus({
            type: 'error',
            message: 'Token de redefinição de senha não fornecido'
          });
          setIsLoading(false);
          return;
        }

        // Validate the reset password token
        const result = await AuthService.validateResetPasswordToken(urlToken);
        
        if (result.success && result.email) {
          setIsTokenValid(true);
          setToken(urlToken);
          setEmail(result.email);
        } else {
          setIsTokenValid(false);
          setStatus({
            type: 'error',
            message: 'Token inválido ou expirado'
          });
        }
        
        setIsLoading(false);
      } catch (error: any) {
        setIsTokenValid(false);
        setStatus({
          type: 'error',
          message: error.message || 'Erro ao verificar token de redefinição de senha'
        });
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const calculatePasswordStrength = (value: string) => {
    let strength = 0;
    if (value.length >= 8) strength++;
    if (value.match(/[A-Z]/)) strength++;
    if (value.match(/[a-z]/)) strength++;
    if (value.match(/[0-9]/)) strength++;
    if (value.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
    setPasswordsMatch(newPassword === confirmPassword);
    setStatus(null);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordsMatch(password === newConfirmPassword);
    setStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all inputs
    if (!token) {
      setStatus({
        type: 'error',
        message: 'Token de redefinição de senha não encontrado'
      });
      return;
    }

    if (!email) {
      setStatus({
        type: 'error',
        message: 'E-mail não identificado'
      });
      return;
    }

    if (!password || !confirmPassword) {
      setStatus({
        type: 'error',
        message: 'Por favor, preencha todos os campos'
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({
        type: 'error',
        message: 'As senhas não coincidem'
      });
      return;
    }

    if (passwordStrength < 3) {
      setStatus({
        type: 'error',
        message: 'A senha não atende aos requisitos de segurança'
      });
      return;
    }

    try {
      // Reset password with token
      const result = await AuthService.resetPasswordWithToken({
        token,
        password,
        passwordConfirmation: confirmPassword
      });

      if (result.success) {
        // Attempt to log in the user automatically
        try {
          await login({
            email,
            password
          });

          setStatus({
            type: 'success',
            message: 'Senha alterada com sucesso! Redirecionando...'
          });

          // Redirect to dashboard or home page after successful login
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } catch (loginError: any) {
          // If auto-login fails, redirect to login page
          setStatus({
            type: 'error',
            message: 'Senha alterada, mas falha no login automático. Faça login manualmente.'
          });

          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      }
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.message || 'Erro ao alterar senha. Tente novamente.'
      });
    }
  };

  // Rest of the component remains the same as in the previous implementation
  // (getPasswordStrengthColor, renderStatusMessage, loading and token invalid states)
  // ... [Previous UI rendering code remains unchanged]

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-800">Verificando token...</p>
        </div>
      </div>
    );
  }

  // Token invalid state
  if (isTokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl border border-red-100 p-8 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-4">Token Inválido</h2>
          <p className="text-gray-600 mb-6">
            O link de redefinição de senha expirou ou é inválido. 
            Por favor, solicite um novo link de redefinição.
          </p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/forgot-password')}
          >
            Solicitar Novo Link
          </Button>
        </div>
      </div>
    );
  }

  // Main password reset form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl border border-blue-100 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full translate-x-1/2 translate-y-1/2"></div>

        <div className="p-8 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-blue-800 mb-2 tracking-tight">
              Redefinir Senha
            </h1>
            <p className="text-gray-500 text-sm">
              Crie uma nova senha segura para {email}
            </p>
          </div>

          {renderStatusMessage()}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password input fields remain the same as in previous implementation */}
            {/* ... [Previous input fields code] */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
