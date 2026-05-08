import { UseFormSetError, FieldValues, Path } from 'react-hook-form';
import Toast from 'react-native-toast-message';

import { ApiError } from '@/src/services/api';

export const mapApiErrorsToForm = <T extends FieldValues>(
  error: ApiError,
  setError: UseFormSetError<T>,
) => {
  if (error.errors) {
    Object.entries(error.errors).forEach(([field, messages]) => {
      const message = Array.isArray(messages) ? messages[0] : messages;
      setError(field as Path<T>, {
        type: 'server',
        message: message as string,
      });
    });
  } else {
    // If no specific field errors, show a general toast
    showErrorToast(error.message);
  }
};

export const showErrorToast = (message: string, title: string = 'Error') => {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 4000,
  });
};

export const showSuccessToast = (message: string, title: string = 'Success') => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 3000,
  });
};
