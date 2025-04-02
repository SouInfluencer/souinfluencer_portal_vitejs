import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AuthService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Email validation regex
  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous status
    setStatus(null);
    setIsLoading(true);

    // Validate email
    if (!email) {
      setStatus({
        type: 'error',
        message: 'Por favor, insira um endereço de e-mail'
      });
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setStatus({
        type: 'error',
        message: 'Por favor, insira um endereço de e-mail válido'
      });
      setIsLoading(false);
      return;
    }

    try {
      // Call API to reset password
      await AuthService.resetPassword(email);

      setStatus({
        type: 'success',
        message: `Link de redefinição enviado para ${email}. Verifique sua caixa de entrada.`
      });

      // Clear email input on success
      setEmail('');

      // Optional: Redirect to login after a few seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.message || 'Erro ao enviar link de redefinição. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusMessage = () => {
    if (!status) return null;

    const statusStyles = {
      error: {
        background: 'bg-red-50 border-red-200',
        text: 'text-red-700',
        icon: <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
      },
      success: {
        background: 'bg-blue-50 border-blue-200',
        text: 'text-blue-700',
        icon: <ShieldCheck className="h-5 w-5 text-blue-500 mr-2" />
      }
    };

    const currentStyle = statusStyles[status.type];

    return (
      <div className={`
        flex items-center 
        p-4 rounded-xl 
        ${currentStyle.background} 
        ${currentStyle.text} 
        text-sm 
        mb-4
      `}>
        {currentStyle.icon}
        {status.message}
      </div>
    );
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl border border-blue-100 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full translate-x-1/2 translate-y-1/2"></div>

        <div className="p-8 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-blue-800 mb-2 tracking-tight">
              Esqueceu sua senha?
            </h1>
            <p className="text-gray-500 text-sm">
              Digite seu e-mail para redefinir
            </p>
          </div>

          {renderStatusMessage()}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-blue-400 group-focus-within:text-blue-600 transition" />
              </div>
              <input
                type="email"
                placeholder="Endereço de e-mail"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus(null);
                }}
                className="w-full pl-12 pr-4 py-4 bg-blue-50/50 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-blue-900 placeholder-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl hover:opacity-90 transition duration-300 transform hover:scale-[1.02] active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="animate-pulse">Enviando...</span>
              ) : (
                <>
                  Enviar Link de Redefinição
                  <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleBackToLogin}
              className="text-sm text-blue-600 hover:underline flex items-center justify-center w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
