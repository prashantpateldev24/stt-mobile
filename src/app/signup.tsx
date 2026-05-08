import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { AppButton } from '@/src/components/form/AppButton';
import { TextInput } from '@/src/components/form/TextInput';
import { useSignup } from '@/src/features/auth/hooks/authHooks';
import { SignupFormData, signupSchema } from '@/src/features/auth/schemas/authSchemas';
import { ApiError } from '@/src/services/api';
import { mapApiErrorsToForm } from '@/src/utils/error';

const SignupScreen = () => {
  const router = useRouter();
  const { mutate: signup, isPending } = useSignup();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: SignupFormData) => {
    const formattedData = {
      ...data,
      email: data.email.toLowerCase().trim(),
    };

    signup(formattedData, {
      onSuccess: () => {
        router.push({
          pathname: '/verify-otp',
          params: { email: formattedData.email },
        });
      },
      onError: (error: any) => {
        mapApiErrorsToForm(error as ApiError, setError);
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{'Create Account'}</Text>
          <Text style={styles.subtitle}>{'Start tracking your tasks today'}</Text>
        </View>

        <TextInput
          control={control}
          name="email"
          label="Email Address"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email?.message}
        />

        <TextInput
          control={control}
          name="password"
          label="Password"
          placeholder="Create a password"
          secureTextEntry
          error={errors.password?.message}
        />

        <TextInput
          control={control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Repeat your password"
          secureTextEntry
          error={errors.confirmPassword?.message}
        />

        <AppButton
          title="Sign Up"
          onPress={handleSubmit(onSubmit)}
          isLoading={isPending}
          style={styles.button}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>{'Already have an account? '}</Text>
          <Text style={styles.link} onPress={() => router.push('/login')}>
            {'Log In'}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  link: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
