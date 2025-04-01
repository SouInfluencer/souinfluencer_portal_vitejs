import { api } from './api';

export interface UserSignupData {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  profile: 'INFLUENCER' | 'ADVERTISER';
}

export interface UserCheckResponse {
  exists: boolean;
}

export interface UserSignupResponse {
  id: string;
  owner: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  firstName: string;
  lastName: string;
  email: string;
  profile: 'INFLUENCER' | 'ADVERTISER';
  username: string;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
}

export class UserService {
  static async checkUsername(username: string): Promise<UserCheckResponse> {
    try {
      const response = await api.get<UserCheckResponse>(`/user/check-username`, {
        params: { username }
      });
      return response.data;
    } catch (error) {
      console.error('Username check failed', error);
      throw error;
    }
  }

  static async checkEmail(email: string): Promise<UserCheckResponse> {
    try {
      const response = await api.get<UserCheckResponse>(`/user/check-email`, {
        params: { email }
      });
      return response.data;
    } catch (error) {
      console.error('Email check failed', error);
      throw error;
    }
  }

  static async signup(userData: UserSignupData): Promise<UserSignupResponse> {
    try {
      const response = await api.post<UserSignupResponse>('/user', userData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const apiError = error.response.data as ApiErrorResponse;
        throw new Error(apiError.message || 'Erro ao realizar cadastro');
      }
      throw new Error('Erro de conexão. Tente novamente.');
    }
  }
}
