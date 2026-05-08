import { useMutation } from '@tanstack/react-query';

import { authApi } from '../api/auth.api';
import { useAuthContext } from '../context/AuthContext';
import { LoginFormData, SignupFormData, VerifyOtpFormData } from '../schemas/authSchemas';

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupFormData) => authApi.signup(data),
  });
};

export const useVerifyOtp = () => {
  const { signIn } = useAuthContext();

  return useMutation({
    mutationFn: (data: VerifyOtpFormData) => authApi.verifyOtp(data),
    onSuccess: (data) => {
      signIn(data.token, data.user);
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.resendOtp(email),
  });
};

export const useLogin = () => {
  const { signIn } = useAuthContext();

  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (data) => {
      signIn(data.token, data.user);
    },
  });
};
