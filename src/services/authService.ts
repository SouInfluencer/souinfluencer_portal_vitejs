import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
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
        return response.data;
      });
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
  static extractTokenFromURL(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token');
  }
}
