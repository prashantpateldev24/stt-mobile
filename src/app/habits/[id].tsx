import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { UseFormSetError } from 'react-hook-form';

import { HabitForm } from '@/src/features/habits/components/HabitForm';
import { HabitFormData } from '@/src/features/habits/schemas/habitSchema';
import { mapApiErrorsToForm } from '@/src/utils/error';
import { ApiError } from '@/src/services/api';
import { useHabit, useUpdateHabit } from '@/src/features/habits/hooks/habitHooks';

const EditHabitScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: habit, isLoading: isLoadingHabit } = useHabit(id);
  const { mutate: updateHabit, isPending: isUpdating } = useUpdateHabit();

  const handleSubmit = (data: HabitFormData, setError: UseFormSetError<HabitFormData>) => {
    if (!id) return;
    updateHabit(
      { id, data },
      {
        onSuccess: () => {
          router.back();
        },
        onError: (error: any) => {
          mapApiErrorsToForm(error as ApiError, setError);
        },
      },
    );
  };

  if (isLoadingHabit) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5856D6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {habit && (
        <HabitForm
          initialValues={habit}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
          buttonTitle="Update Habit"
        />
      )}
    </View>
  );
};

export default EditHabitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
