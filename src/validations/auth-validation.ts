import z from 'zod';

export const loginSchemaForm = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});


export const createUserSchema = z.object({
  email: z
  .string()
  .min(1, ' メールアドレスは必須です | Email is required')
  .email('有効なメールアドレスを入力してください | Please enter a valid email'),
  password: z.string().min(1, ' パスワードが必要です |Password is required'),
  name: z.string().min(1, '名前は必須です | Name is required'),
  role: z.string().min(1, '役割を追加する | Add your role'),
  avatar_url: z.union([ z.string().min(1, 'プロフィール写真を入力してください | Please input your Profile Picture'), z.instanceof(File),]),
});


export const updateUserSchema = z.object({
  name: z.string().min(1, '名前は必須です | Name is required'),
  role: z.string().min(1, '役割を追加する | Add your role'),
  avatar_url: z.union([ z.string().min(1, 'プロフィール写真を入力してください | Please input your Profile Picture'), z.instanceof(File),]),
});




export type LoginForm = z.infer<typeof loginSchemaForm>;
export type CreateUserForm = z.infer<typeof createUserSchema>;
export type UpdateUserForm = z.infer<typeof updateUserSchema>;