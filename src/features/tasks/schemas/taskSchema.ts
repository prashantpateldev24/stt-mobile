import * as yup from 'yup';

export const taskSchema = yup.object().shape({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().optional().max(200, 'Description is too long'),
  dueDate: yup.string().required('Due date is required'),
  priority: yup.string().oneOf(['low', 'medium', 'high']).default('medium'),
  completed: yup.boolean().default(false),
});

export type TaskFormData = yup.InferType<typeof taskSchema>;
