import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AppButton } from '@/src/components/form/AppButton';
import { OtpInput } from '@/src/components/OtpInput';
import { colors } from '@/src/constants/theme';
import { useResendOtp, useVerifyOtp } from '@/src/features/auth/hooks/authHooks';
import { VerifyOtpFormData, verifyOtpSchema } from '@/src/features/auth/schemas/authSchemas';
import { showErrorToast, showSuccessToast } from '@/src/utils/error';

import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const TIMER_DURATION = 300;

const VerifyOtpScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { mutate: verifyOtp, isPending } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  const [timer, setTimer] = useState(TIMER_DURATION);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormData>({
    resolver: yupResolver(verifyOtpSchema),
    defaultValues: {
      email: email || '',
      otp: '',
    },
  });

  const onSubmit = (data: VerifyOtpFormData) => {
    verifyOtp(data, {
      onSuccess: () => {
        router.replace('/(tabs)');
      },
      onError: (error: any) => {
        showErrorToast(error.message || 'Invalid OTP');
      },
    });
  };

  const handleResend = () => {
    if (!email) return;
    resendOtp(email, {
      onSuccess: () => {
        showSuccessToast('OTP resent successfully');
        setTimer(TIMER_DURATION);
        setCanResend(false);
      },
      onError: (error: any) => {
        showErrorToast(error.message || 'Failed to resend OTP');
      },
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 4-digit code sent to {'\n'}
            <Text style={styles.emailHighlight}>{email}</Text>
          </Text>
        </View>

        <Controller
          control={control}
          name="otp"
          render={({ field: { onChange, value } }) => (
            <OtpInput length={4} value={value} onChange={onChange} error={!!errors.otp} />
          )}
        />
        {errors.otp && <Text style={styles.errorText}>{errors.otp.message}</Text>}

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            {canResend ? 'Didn’t receive the code?' : `Resend code in ${formatTime(timer)}`}
          </Text>
          <TouchableOpacity disabled={!canResend || isResending} onPress={handleResend}>
            <Text style={[styles.resendLink, !canResend && styles.disabledLink]}>Resend OTP</Text>
          </TouchableOpacity>
        </View>

        <AppButton
          title="Verify & Login"
          onPress={handleSubmit(onSubmit)}
          isLoading={isPending}
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  emailHighlight: {
    color: '#007AFF',
    fontWeight: '600',
  },
  button: {
    width: '100%',
    marginTop: 32,
  },
  timerContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  resendLink: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  disabledLink: {
    color: '#AEAEB2',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  backButton: {
    marginTop: 24,
    padding: 12,
  },
  backButtonText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
  },
});
