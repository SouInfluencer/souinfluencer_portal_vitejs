import React, { useState } from 'react';
import { Lock, User, ArrowRight, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {Card, CardContent, CardFooter, CardHeader} from "../components/ui/Card.tsx";

// Interface para as credenciais
interface LoginCredentials {
  email: string;
  password: string;
}

// Componente de notificação para reutilização
const Notification = ({ type, message, onClose }: {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}) => {
  return (
      <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
              type === 'success' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
          }`}
      >
        {type === 'success' ? <CheckCircle className="mr-2 h-5 w-5" /> : <AlertTriangle className="mr-2 h-5 w-5" />}
        {message}
        <button
            onClick={onClose}
            className="ml-4 text-sm font-medium text-white underline hover:text-gray-200 transition"
            aria-label="Fechar notificação"
        >
            Fechar
        </button>
      </div>
  );
};

const LoginPage: React.FC = () => {
  // Estado para as credenciais
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Handler para mudanças nos inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para validar o email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para mostrar notificações
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handler para submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = credentials;

    // Validação
    if (!email || !password) {
      showNotification('error', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!isValidEmail(email)) {
      showNotification('error', 'Por favor, insira um endereço de e-mail válido.');
      return;
    }

    setIsLoading(true);
    try {
      await login(credentials);
      showNotification('success', 'Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      showNotification('error', 'Falha no login. Verifique suas credenciais');
    } finally {
      setIsLoading(false);
    }
  };

  // Toogle para mostrar/esconder senha
  const toggleShowPassword = () => setShowPassword(prev => !prev);

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4 relative">
        {notification && (
            <Notification
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification(null)}
            />
        )}

        <Card className="w-full max-w-md bg-white shadow-2xl rounded-3xl border border-blue-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full translate-x-1/2 translate-y-1/2"></div>

          <CardHeader className="text-center pb-0 pt-8 px-8">
            <h1 className="text-4xl font-extrabold text-blue-800 mb-2 tracking-tight">Sou Influencer</h1>
            <p className="text-gray-500 text-sm">Entre com suas credenciais</p>
          </CardHeader>

          <CardContent className="p-8 pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-blue-400 group-focus-within:text-blue-600 transition" />
                </div>
                <input
                    type="email"
                    name="email"
                    placeholder="Endereço de e-mail"
                    value={credentials.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-blue-50/50 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-blue-900 placeholder-blue-400"
                    required
                    aria-label="Email"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-400 group-focus-within:text-blue-600 transition" />
                </div>
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Senha"
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 bg-blue-50/50 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-blue-900 placeholder-blue-400"
                    required
                    aria-label="Senha"
                />
                <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-400 hover:text-blue-600 transition"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl hover:opacity-90 transition duration-300 transform hover:scale-[1.02] active:scale-95 group ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-busy={isLoading}
              >
                {isLoading ? 'Carregando...' : 'Entrar'}
                {!isLoading && <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition" />}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="/esqueci-a-senha" className="text-sm text-blue-600 hover:underline">Esqueceu sua senha?</a>
            </div>
          </CardContent>

          <CardFooter className="mt-4 pt-6 border-t border-blue-100 text-center px-8 pb-8">
            <div className="w-full">
              <p className="text-gray-500 mb-2 text-sm">Não tem uma conta?</p>
              <a href="/cadastro" className="text-blue-600 hover:underline font-semibold">Criar conta</a>
            </div>
          </CardFooter>
        </Card>
      </div>
  );
};

export default LoginPage;