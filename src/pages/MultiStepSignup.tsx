import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Megaphone, ChevronRight, ChevronLeft,
  CheckCircle, Mail, Lock, Eye, EyeOff, Loader
} from 'lucide-react';

import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';
import {NotificationComponent} from "../components/ui/NotificationComponent.tsx";
import {Card, CardContent, CardFooter, CardHeader} from "../components/ui/Card.tsx";

// Types Definition
type AccountType = 'INFLUENCER' | 'ADVERTISER';
type StepType = 1 | 2 | 3 | 4;

// Signup Data Interface
interface SignupData {
  profile: AccountType;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Errors Interface
interface SignupErrors {
  accountType?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const MultiStepSignup: React.FC = () => {
  const navigate = useNavigate();

  // State Management
  const [currentStep, setCurrentStep] = useState<StepType>(1);
  const [signupData, setSignupData] = useState<SignupData>({
    profile: '' as AccountType,
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Username Availability Check
  const checkUsernameAvailability = useCallback(async (): Promise<boolean> => {
    if (!signupData.username.trim()) return false;

    setIsCheckingUsername(true);
    try {
      const response = await UserService.checkUsername(signupData.username);
      if (response.exists) {
        setErrors(prev => ({
          ...prev,
          username: 'Nome de usuário já está em uso'
        }));
        return false;
      }
      return true;
    } catch (error) {
      console.error('Username check failed:', error);
      setErrors(prev => ({
        ...prev,
        username: 'Erro ao verificar disponibilidade do usuário'
      }));
      return false;
    } finally {
      setIsCheckingUsername(false);
    }
  }, [signupData.username]);

  // Email Availability Check
  const checkEmailAvailability = useCallback(async (): Promise<boolean> => {
    if (!signupData.email.trim()) return false;

    setIsCheckingEmail(true);
    try {
      const response = await UserService.checkEmail(signupData.email);
      if (response.exists) {
        setErrors(prev => ({
          ...prev,
          email: 'E-mail já está em uso'
        }));
        return false;
      }
      return true;
    } catch (error) {
      console.error('Email check failed:', error);
      setErrors(prev => ({
        ...prev,
        email: 'Erro ao verificar disponibilidade do e-mail'
      }));
      return false;
    } finally {
      setIsCheckingEmail(false);
    }
  }, [signupData.email]);

  // Validation Function
  const validateStep = useCallback(async (step: StepType): Promise<boolean> => {
    const newErrors: SignupErrors = {};

    switch (step) {
      case 1:
        if (!signupData.profile) {
          newErrors.accountType = 'Selecione um tipo de conta';
        }
        break;

      case 2:
        if (!signupData.username.trim()) {
          newErrors.username = 'Nome de usuário é obrigatório';
        } else if (signupData.username.length < 4) {
          newErrors.username = 'Nome de usuário deve ter no mínimo 4 caracteres';
        } else {
          const isAvailable = await checkUsernameAvailability();
          if (!isAvailable) return false;
        }
        break;

      case 3:
        if (!signupData.firstName.trim()) {
          newErrors.firstName = 'Primeiro nome é obrigatório';
        }
        if (!signupData.lastName.trim()) {
          newErrors.lastName = 'Sobrenome é obrigatório';
        }
        if (!signupData.email.trim()) {
          newErrors.email = 'E-mail é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
          newErrors.email = 'E-mail inválido';
        } else {
          const isEmailAvailable = await checkEmailAvailability();
          if (!isEmailAvailable) return false;
        }
        break;

      case 4:
        if (!signupData.password) {
          newErrors.password = 'Senha é obrigatória';
        } else if (signupData.password.length < 8) {
          newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
        }
        if (signupData.password !== confirmPassword) {
          newErrors.confirmPassword = 'Senhas não coincidem';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [signupData, confirmPassword, checkUsernameAvailability, checkEmailAvailability]);

  // Step Navigation
  const goToNextStep = useCallback(async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1 as StepType);
      } else {
        await handleSubmit();
      }
    }
  }, [currentStep, validateStep]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1 as StepType);
    }
  }, [currentStep]);

  // Form Submission
  // Form Submission
  const handleSubmit = useCallback(async () => {
    if (!(await validateStep(4))) return;

    setIsLoading(true);
    setErrors({});

    try {
      // 1. Primeiro faz o cadastro
      await UserService.signup(signupData);

      // 2. Depois faz o login automático
      await AuthService.login({
        email: signupData.email,
        password: signupData.password
      });

      // 3. Verifica se o login foi realmente bem-sucedido
      if (!AuthService.isAuthenticated()) {
        throw new Error('Authentication failed after successful login');
      }

      // 4. Mostra notificação e navega
      setNotification({
        type: 'success',
        message: 'Cadastro realizado com sucesso!'
      });

      // 5. Espera um pouco para mostrar a notificação
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 6. Navega com replace para evitar voltar para a página de cadastro
      setTimeout(() => navigate('/dashboard', { replace: true }), 1500);

    } catch (error: any) {
      console.error('Signup error:', error);

      setErrors({
        general: error.message || 'Erro ao realizar cadastro'
      });

      setNotification({
        type: 'error',
        message: error.message || 'Não foi possível completar o cadastro'
      });

      // Se foi erro de login após cadastro bem-sucedido, redireciona para login
      if (error.message.includes('Authentication failed after successful login')) {
        setTimeout(() => navigate('/login', { replace: true }), 1500);
      }
    } finally {
      setIsLoading(false);
    }
  }, [signupData, navigate, validateStep]);

  // Reset errors when changing steps
  useEffect(() => {
    setErrors({});
  }, [currentStep]);

  // Step Content Rendering
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Escolha seu tipo de conta
                </h2>
                <p className="text-gray-600 mb-6">
                  Selecione o tipo de conta que melhor se adequa ao seu perfil
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AccountTypeCard
                    type="INFLUENCER"
                    icon={(props) => <Users {...props} />}
                    title="Influenciador"
                    description="Crie conteúdo e expanda sua audiência"
                    isSelected={signupData.profile === 'INFLUENCER'}
                    onSelect={() => setSignupData(prev => ({...prev, profile: 'INFLUENCER'}))}
                />
                <AccountTypeCard
                    type="ADVERTISER"
                    icon={(props) => <Megaphone {...props} />}
                    title="Anunciante"
                    description="Encontre influenciadores para suas campanhas"
                    isSelected={signupData.profile === 'ADVERTISER'}
                    onSelect={() => setSignupData(prev => ({...prev, profile: 'ADVERTISER'}))}
                />
              </div>
              {errors.accountType && (
                  <p className="text-red-500 text-sm text-center mt-4">
                    {errors.accountType}
                  </p>
              )}
            </div>
        );

      case 2:
        return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Escolha seu nome de usuário
                </h2>
                <p className="text-gray-600 mb-6">
                  Seu nome de usuário único para identificação na plataforma
                </p>
              </div>
              <div className="relative">
                <Input
                    placeholder="Nome de usuário"
                    value={signupData.username}
                    onChange={(e) => {
                      setSignupData(prev => ({...prev, username: e.target.value}));
                      setErrors(prev => ({...prev, username: undefined}));
                    }}
                    error={errors.username}
                    disabled={isCheckingUsername}
                />
                {isCheckingUsername && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader className="animate-spin text-blue-500" size={20} />
                    </div>
                )}
              </div>
            </div>
        );

      case 3:
        return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Seus dados pessoais
                </h2>
                <p className="text-gray-600 mb-6">
                  Informe seus dados para criação da conta
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    placeholder="Primeiro nome"
                    value={signupData.firstName}
                    onChange={(e) => setSignupData(prev => ({...prev, firstName: e.target.value}))}
                    error={errors.firstName}
                />
                <Input
                    placeholder="Sobrenome"
                    value={signupData.lastName}
                    onChange={(e) => setSignupData(prev => ({...prev, lastName: e.target.value}))}
                    error={errors.lastName}
                />
              </div>
              <div className="relative">
                <Input
                    placeholder="E-mail"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => {
                      setSignupData((prev) => ({...prev, email: e.target.value}));
                      setErrors((prev) => ({...prev, email: undefined}));
                    }}
                    error={errors.email}
                    disabled={isCheckingEmail}
                    rightIcon={<Mail className="text-gray-400"/>}
                />
                {isCheckingEmail && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader className="animate-spin text-blue-500" size={20}/>
                    </div>
                )}
              </div>
            </div>
        );

      case 4:
        return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Crie sua senha
                </h2>
                <p className="text-gray-600 mb-6">
                  Escolha uma senha com no mínimo 8 caracteres
                </p>
              </div>
              <div className="space-y-4">
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={signupData.password}
                    onChange={(e) => setSignupData(prev => ({...prev, password: e.target.value}))}
                    error={errors.password}
                    rightIcon={showPassword ? <EyeOff/> : <Eye/>}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                />
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirmar senha"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors(prev => ({...prev, confirmPassword: undefined}));
                    }}
                    error={errors.confirmPassword}
                    rightIcon={<Lock/>}
                />
              </div>
            </div>
        );
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4 relative">
        {notification && (
            <NotificationComponent
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification(null)}
            />
        )}

        <Card className="w-full max-w-md bg-white shadow-2xl rounded-3xl border border-blue-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full translate-x-1/2 translate-y-1/2"></div>

          {/* Progress Indicator */}
          <CardHeader className="pb-0 pt-8 px-8">
            <div className="flex justify-between items-center space-x-2 mb-6">
              {([1, 2, 3, 4] as StepType[]).map((step) => (
                  <div
                      key={step}
                      className={`
                  flex-1 h-2 rounded-full transition-all duration-300
                  ${currentStep >= step
                          ? 'bg-blue-500'
                          : 'bg-gray-300'}
                `}
                  />
              ))}
            </div>
            <h1 className="text-4xl font-extrabold text-blue-800 mb-2 tracking-tight text-center">
              Criar conta
            </h1>
          </CardHeader>

          <CardContent className="p-8 pt-4">
            <form onSubmit={(e) => { e.preventDefault(); goToNextStep(); }}>
              {renderStepContent()}

              {/* General Error Message */}
              {errors.general && (
                  <div className="mt-4 text-center text-red-500 text-sm">
                    {errors.general}
                  </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={goToPreviousStep}
                        icon={ChevronLeft}
                        className="w-1/3"
                    >
                      Voltar
                    </Button>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    icon={currentStep === 4 ? CheckCircle : ChevronRight}
                    loading={isLoading || isCheckingUsername || isCheckingEmail}
                    className={`
                  ${currentStep === 1 ? "w-full" : "w-1/2 ml-auto"}
                  transition-all duration-300
                `}
                >
                  {currentStep === 4 ? 'Finalizar Cadastro' : 'Próximo'}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="mt-4 pt-6 border-t border-blue-100 text-center px-8 pb-8">
            <div className="w-full">
              <p className="text-gray-500 mb-2 text-sm">Já tem uma conta?</p>
              <a href="/login" className="text-blue-600 hover:underline font-semibold">
                Faça login
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
  );
};

// Account Type Card Component
interface AccountTypeCardProps {
  type: AccountType;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

const AccountTypeCard: React.FC<AccountTypeCardProps> = ({
                                                           type,
                                                           icon: Icon,
                                                           title,
                                                           description,
                                                           isSelected,
                                                           onSelect
                                                         }) => (
    <div
        className={`
      border-2 rounded-xl p-6 text-center cursor-pointer transition-all duration-300
      ${isSelected
            ? type === 'INFLUENCER'
                ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                : 'border-green-500 bg-green-50 shadow-lg transform scale-105'
            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/20'}
    `}
        onClick={onSelect}
    >
      <Icon
          size={48}
          className={`mx-auto mb-4 ${
              isSelected
                  ? type === 'INFLUENCER'
                      ? 'text-blue-600'
                      : 'text-green-600'
                  : 'text-gray-400'
          }`}
      />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500 mt-2">
        {description}
      </p>
    </div>
);

export default MultiStepSignup;
