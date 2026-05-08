import { TouchableOpacityProps } from 'react-native';

import { Button } from '../Button';

interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
}

export const AppButton = ({ ...props }: AppButtonProps) => {
  return <Button {...props} />;
};
