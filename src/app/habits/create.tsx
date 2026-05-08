import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { UseFormSetError } from 'react-hook-form';

import { useCreateHabit } from '@/src/features/habits/hooks/habitHooks';
import { HabitForm } from '@/src/features/habits/components/HabitForm';
import { HabitFormData } from '@/src/features/habits/schemas/habitSchema';
import { mapApiErrorsToForm } from '@/src/utils/error';
import { ApiError } from '@/src/services/api';

const CreateHabitScreen = () => {
  const router = useRouter();
  const { mutate: createHabit, isPending } = useCreateHabit();

  const handleSubmit = (data: HabitFormData, setError: UseFormSetError<HabitFormData>) => {
    createHabit(data, {
      onSuccess: () => {
        router.dismiss();
      },
      onError: (error: any) => {
        mapApiErrorsToForm(error as ApiError, setError);
      },
    });
  };

  return (
    <View style={styles.container}>
      <HabitForm onSubmit={handleSubmit} isLoading={isPending} buttonTitle="Create Habit" />
    </View>
  );
};

export default CreateHabitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
