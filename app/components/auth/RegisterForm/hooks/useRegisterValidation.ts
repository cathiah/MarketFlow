import { useMemo } from "react";
import type { RegisterFormData, RegisterFieldErrors, RegisterActionData } from "../registerForm.types";

export function useRegisterValidation(formData: RegisterFormData, actionData: RegisterActionData) {
  const isEmailValid = useMemo(
    () => /^\S+@\S+\.\S+$/.test(formData.email),
    [formData.email]
  );

  const isUsernameValid = formData.username.length >= 3;

  const isPasswordValid = useMemo(
    () => formData.password.length >= 8 && /\d/.test(formData.password),
    [formData.password]
  );

  const passwordsMatch = formData.password === formData.confirmPassword;

  const canSubmit =
    isEmailValid &&
    isUsernameValid &&
    formData.full_name.length > 1 &&
    isPasswordValid &&
    passwordsMatch &&
    formData.accepted;

  const fieldErrors = useMemo<RegisterFieldErrors>(() => {
    const errors: RegisterFieldErrors = {};

    if (formData.full_name && formData.full_name.length < 2)
      errors.full_name = "Le nom est trop court.";

    if (formData.username && formData.username.length < 3)
      errors.username = "3 caractères minimum.";

    if (formData.email && !isEmailValid)
      errors.email = "Email invalide.";

    if (formData.password && !isPasswordValid)
      errors.password = "8+ caractères et au moins 1 chiffre.";

    if (formData.confirmPassword && !passwordsMatch)
      errors.confirmPassword = "Les mots de passe ne correspondent pas.";

    if (actionData?.errors) {
      Object.keys(actionData.errors).forEach((key) => {
        if (!errors[key]) {
          errors[key] = (actionData.errors as Record<string, string[]>)[key][0];
        }
      });
    }

    return errors;
  }, [formData, actionData, isEmailValid, isPasswordValid, passwordsMatch]);

  return { canSubmit, fieldErrors };
}
