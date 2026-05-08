import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';

import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema, LoginFormData } from '@/src/features/auth/schemas/authSchemas';
import { useLogin } from '@/src/features/auth/hooks/authHooks';
import { TextInput } from '@/src/components/form/TextInput';
import { AppButton } from '@/src/components/form/AppButton';
import { mapApiErrorsToForm } from '@/src/utils/error';
import { ApiError } from '@/src/services/api';

const LoginScreen = () => {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    // Force email to lowercase
    const formattedData = {
      ...data,
      email: data.email.toLowerCase().trim(),
    };

    login(formattedData, {
      onSuccess: () => {
        router.replace('/(tabs)');
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to continue</Text>
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
          placeholder="Enter your password"
          secureTextEntry
          error={errors.password?.message}
        />

        <AppButton
          title="Log In"
          onPress={handleSubmit(onSubmit)}
          isLoading={isPending}
          style={styles.button}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Text style={styles.link} onPress={() => router.push('/signup')}>
            Sign Up
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
