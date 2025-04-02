import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  firtname?: string;
  lastname?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface PasswordResetRequest {
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface PasswordResetInitiateRequest {
  email: string;
}

export class AuthService {
  static getUserData(): User | null {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        return JSON.parse(userDataString);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  static saveUserData(response: LoginResponse) {
    localStorage.setItem('userToken', response.token);
    localStorage.setItem('userData', JSON.stringify(response.user));
  }

  static login(credentials: LoginCredentials): Promise<LoginResponse> {
    return api.post<LoginResponse>('/auth', credentials)
        .then(response => {
          this.saveUserData(response.data);
          // Adiciona verificação de salvamento
          const savedToken = localStorage.getItem('userToken');
          const savedUser = localStorage.getItem('userData');

          if (!savedToken || !savedUser) {
            throw new Error('Failed to save authentication data');
          }

          return response.data;
        })
        .catch(error => {
          // Limpa os dados em caso de erro
          this.logout();
          throw error;
        });
  }

  static isAuthenticated(): boolean {
    const token = localStorage.getItem('userToken');
    return !!token; // Retorna true se o token existir
  }

  static logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  }

  // Method for initiating password reset (used in ForgotPasswordPage)
  static async resetPassword(email: string): Promise<{ 
    success: boolean, 
    message?: string 
  }> {
    try {
      const response = await api.post<{ 
        success: boolean, 
        message?: string 
      }>('/auth/reset-password', { email });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        throw new Error(errorData.message || 'Erro ao solicitar redefinição de senha');
      }
      throw new Error('Erro de conexão. Tente novamente.');
    }
  }

  static async initiatePasswordReset(email: string): Promise<{ 
    success: boolean, 
    message?: string 
  }> {
    try {
      const response = await api.post<{ 
        success: boolean, 
        message?: string 
      }>('/auth/reset-password', { email });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        throw new Error(errorData.message || 'Erro ao solicitar redefinição de senha');
      }
      throw new Error('Erro de conexão. Tente novamente.');
    }
  }

  static async validateResetPasswordToken(token: string): Promise<{ 
    success: boolean, 
    email?: string 
  }> {
    try {
      const response = await api.post<{ 
        success: boolean, 
        email?: string 
      }>('/auth/check-code-reset-password', { token });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        throw new Error(errorData.message || 'Token inválido ou expirado');
      }
      throw new Error('Erro de conexão. Tente novamente.');
    }
  }

  // Renamed method to match the usage in ChangePasswordPage
  static async resetPasswordWithToken(data: PasswordResetRequest): Promise<{ 
    success: boolean, 
    email?: string 
  }> {
    try {
      const response = await api.post<{ 
        success: boolean, 
        email?: string 
      }>('/auth/change-password', data);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        throw new Error(errorData.message || 'Erro ao redefinir senha');
      }
      throw new Error('Erro de conexão. Tente novamente.');
    }
  }

  // Utility method to extract token from URL
  static extractTokenFromURL(url?: string): string | null {
    // Usa a URL fornecida ou a URL atual do navegador
    const urlString = url || window.location.href;

    try {
      // Cria um objeto URL para facilitar a manipulação
      const urlObject = new URL(urlString);

      // Extrai os parâmetros da query
      const urlParams = new URLSearchParams(urlObject.search);

      // Retorna o parâmetro 'token' ou null se não existir
      return urlParams.get('token');
    } catch (error) {
      console.error('Erro ao extrair token da URL:', error);
      return null;
    }
  }
}
