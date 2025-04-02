import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, KeyRound, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { AuthService } from '../services/authService';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Estado unificado
  const [formState, setFormState] = useState({
    password: '',
    passwordConfirmation: '',
    showPassword: false,
    showPasswordConfirmation: false
  });

  // Estado de validação simplificado - apenas comprimento mínimo
  const [passwordIsValid, setPasswordIsValid] = useState(false);

  // Estados de controle
  const [token, setToken] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<{ type: 'error' | 'success' | 'submitting'; message: string } | null>(null);

  // Verificar se as senhas coincidem
  const passwordsMatch = formState.password === formState.passwordConfirmation && formState.password !== '';

  // Verificar token na montagem do componente
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Extrair token da URL
        const urlToken = AuthService.extractTokenFromURL();

        if (!urlToken) {
          setStatus({
            type: 'error',
            message: 'Token de redefinição de senha não fornecido'
          });
          setIsLoading(false);
          return;
        }

        // Validar o token de reset de senha
        const result = await AuthService.validateResetPasswordToken(urlToken);

        if (result.success) {
          setIsTokenValid(true);
          setToken(urlToken);
        } else {
          setIsTokenValid(false);
          setStatus({
            type: 'error',
            message: 'Token inválido ou expirado'
          });
        }
      } catch (error) {
        setIsTokenValid(false);
        const errorMessage = (error instanceof Error) ? error.message : 'Erro desconhecido';
        setStatus({
          type: 'error',
          message: errorMessage || 'Erro ao verificar token de redefinição de senha'
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken().then(() => {});
  }, []);

  // Validar senha em tempo real - apenas verifica comprimento mínimo
  useEffect(() => {
    setPasswordIsValid(formState.password.length >= 8);
  }, [formState.password]);

  // Manipulador de alteração de input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar status de erro quando o usuário começa a digitar novamente
    if (status?.type === 'error') {
      setStatus(null);
    }
  };

  // Alternar visibilidade da senha
  const togglePasswordVisibility = (field: 'showPassword' | 'showPasswordConfirmation') => {
      setFormState(prev => ({
        ...prev,
        [field]: !prev[field]
      }));
  };

  // Manipulador de envio do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { password, passwordConfirmation } = formState;

    // Validar entradas
    if (!token) {
      setStatus({
        type: 'error',
        message: 'Token de redefinição de senha não encontrado'
      });
      return;
    }

    if (!password || !passwordConfirmation) {
      setStatus({
        type: 'error',
        message: 'Por favor, preencha todos os campos'
      });
      return;
    }

    if (password !== passwordConfirmation) {
      setStatus({
        type: 'error',
        message: 'As senhas não coincidem'
      });
      return;
    }

    if (!passwordIsValid) {
      setStatus({
        type: 'error',
        message: 'A senha deve ter pelo menos 8 caracteres'
      });
      return;
    }

    // Submeter formulário
    try {
      setStatus({
        type: 'submitting',
        message: 'Alterando senha...'
      });

      // Resetar senha com token
      const result = await AuthService.resetPasswordWithToken({
        token,
        password,
        passwordConfirmation
      });

      if (result.success) {
        setStatus({
          type: 'success',
          message: 'Senha alterada com sucesso! Redirecionando...'
        });

        // Tentar login automático
        try {
          await login({
            email: result.email || '',
            password
          });

          // Redirecionar para dashboard após login bem-sucedido
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } catch (loginError) {
          // Se o login automático falhar, redirecionar para página de login
          setStatus({
            type: 'success',
            message: 'Senha alterada, mas falha no login automático. Redirecionando para login...'
          });

          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Erro ao alterar senha. Tente novamente.'
      });
    }
  };

  // Estado de carregamento
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

  // Estado de token inválido
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
                className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl hover:opacity-90 transition duration-300 transform hover:scale-105 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
                variant="primary"
                onClick={() => navigate('/esqueci-a-senha')}
            >
              Solicitar Novo Link
            </Button>
          </div>
        </div>
    );
  }

  // Formulário principal de redefinição de senha
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl border border-blue-100 overflow-hidden relative">
          {/* Elementos decorativos */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full translate-x-1/2 translate-y-1/2"></div>

          <div className="p-8 relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-blue-800 mb-2 tracking-tight">
                Redefinir Senha
              </h1>
              <p className="text-gray-500 text-sm">
                Crie uma nova senha segura
              </p>
            </div>

            {status && (
                <div className={`mb-6 p-4 rounded-lg ${
                    (status as { type: string }).type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                        (status as { type: string }).type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                            'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  <p className="flex items-center">
                    {(status as { type: string }).type === 'error' && <XCircle className="w-5 h-5 mr-2" />}
                    {(status as { type: string }).type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
                    {status.message}
                  </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Nova Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400"/>
                  </div>
                  <input
                      id="password"
                      name="password"
                      type={formState.showPassword ? "text" : "password"}
                      required
                      value={formState.password}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-px min-h-[44px]"
                      placeholder="••••••••"
                  />
                  <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility('showPassword')}
                  >
                    {formState.showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Indicador simplificado de força de senha - apenas comprimento */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`w-full h-1 rounded-full ${passwordIsValid ? 'bg-green-500' : 'bg-gray-200'}`}></span>
                    <span className="text-xs text-gray-500">
                    {passwordIsValid ? 'Válida' : 'Inválida'}
                  </span>
                  </div>

                  <div className="text-xs space-y-1 text-gray-500">
                    <div className="flex items-center">
                      {passwordIsValid ? (
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                          <XCircle className="h-3 w-3 text-gray-400 mr-1" />
                      )}
                      Mínimo de 8 caracteres
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirme a Nova Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400"/>
                  </div>
                  <input
                      id="passwordConfirmation"
                      name="passwordConfirmation"
                      type={formState.showPasswordConfirmation ? "text" : "password"}
                      required
                      value={formState.passwordConfirmation}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-10 py-3 border ${
                          formState.passwordConfirmation && !passwordsMatch
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-px min-h-[44px]`}
                      placeholder="••••••••"
                  />
                  <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility('showPasswordConfirmation')}
                  >
                    {formState.showPasswordConfirmation ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {formState.passwordConfirmation && !passwordsMatch && (
                    <p className="mt-2 text-sm text-red-600">As senhas não coincidem</p>
                )}
              </div>

              <div>
                <button
                    type="submit"
                    disabled={status?.type === 'submitting'}
                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 min-h-[44px]"
                >
                  {status?.type === 'submitting' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                  strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Alterando senha...
                      </>
                  ) : (
                      'Alterar Senha'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default ChangePasswordPage;