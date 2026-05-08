import { api } from '@/src/services/api';
import { LoginFormData, SignupFormData, VerifyOtpFormData } from '../schemas/authSchemas';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  isVerified?: boolean;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: AuthUser;
  };
}

export const authApi = {
  signup: async (data: SignupFormData) => {
    const response = await api.post<any>('/auth/signup', {
      email: data.email,
      password: data.password,
    });
    return response.data.data;
  },

  verifyOtp: async (data: VerifyOtpFormData) => {
    const response = await api.post<AuthResponse>('/auth/verify-otp', data);
    return response.data.data;
  },

  resendOtp: async (email: string) => {
    const response = await api.post<any>('/auth/resend-otp', { email });
    return response.data.data;
  },

  login: async (data: LoginFormData) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data.data;
  },
};
