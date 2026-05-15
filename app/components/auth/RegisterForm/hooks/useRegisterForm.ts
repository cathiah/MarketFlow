import { useState, useCallback, useEffect } from "react";
import { useActionData } from "react-router";
import type { RegisterFormData, RegisterActionData } from "../registerForm.types";

const INITIAL_FORM_DATA: RegisterFormData = {
  full_name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "buyer",
  accepted: false,
};

export function useRegisterForm() {
  const actionData = useActionData() as RegisterActionData;
  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM_DATA);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (actionData?.success) {
      setShowSuccess(true);
      setFormData(INITIAL_FORM_DATA);
      const timer = setTimeout(() => setShowSuccess(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [actionData]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const val =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
      setFormData((prev) => ({ ...prev, [name]: val }));
    },
    []
  );

  const toggleShowPassword = useCallback(() => setShowPassword((v) => !v), []);

  return {
    formData,
    actionData,
    showSuccess,
    showPassword,
    handleChange,
    toggleShowPassword,
  };
}
