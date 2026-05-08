import * as yup from 'yup';

export const habitSchema = yup.object().shape({
  name: yup
    .string()
    .required('Habit name is required')
    .min(3, 'Name must be at least 3 characters'),
  frequency: yup.string().oneOf(['daily', 'weekly']).default('daily'),
  category: yup.string().optional(),
});

export type HabitFormData = yup.InferType<typeof habitSchema>;
