export type RegisterActionData = {
  success?: boolean;
  error?: string;
  errors?: {
    full_name?: string[];
    username?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
} | null;

export type RegisterFormData = {
  full_name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  accepted: boolean;
};

export type RegisterFieldErrors = Record<string, string>;
