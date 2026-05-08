import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

import { colors } from '@/src/constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
  title,
  isLoading,
  variant = 'primary',
  size = 'md',
  style,
  disabled,
  ...props
}: ButtonProps) => {
  const isButtonDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        isButtonDisabled && styles.disabled,
        style as ViewStyle,
      ]}
      disabled={isButtonDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.tint : '#FFF'}
        />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`${size}Text`],
            variant === 'outline' && { color: colors.tint },
            variant === 'ghost' && { color: colors.tint },
            variant === 'danger' && { color: '#FFF' },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  primary: { backgroundColor: '#007AFF' },
  secondary: { backgroundColor: '#5856D6' },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#007AFF',
  },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: '#FF3B30' },
  disabled: { opacity: 0.5 },
  sm: { height: 36, paddingHorizontal: 12 },
  md: { height: 48, paddingHorizontal: 20 },
  lg: { height: 56, paddingHorizontal: 28 },
  text: {
    fontWeight: '600',
    color: '#FFF',
  },
  smText: { fontSize: 14 },
  mdText: { fontSize: 16 },
  lgText: { fontSize: 18 },
});
