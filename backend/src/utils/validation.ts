import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, 'Имя должно быть заполнено'),
  login: z.string().min(3, 'Логин должен содержать не менее 3 символов'),
  password: z.string().min(3, 'Пароль должен содержать не менее 3 символов'),
});

export type UserInput = z.infer<typeof userSchema>;
