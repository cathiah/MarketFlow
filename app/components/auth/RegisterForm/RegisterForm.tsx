import { Form, useNavigation } from "react-router";
import { Mail, User, AtSign, UserPlus } from "lucide-react";
import { AuthInput, AuthButton, RoleSelector } from "../AuthUI";
import { StatusMessage } from "~/components/shared/StatusMessage";
import { PasswordField } from "./PasswordField";
import { AcceptanceCheckbox } from "./AcceptanceCheckbox";
import { useRegisterForm } from "./hooks/useRegisterForm";
import { useRegisterValidation } from "./hooks/useRegisterValidation";

export function RegisterForm() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const {
    formData,
    actionData,
    showSuccess,
    showPassword,
    handleChange,
    toggleShowPassword,
  } = useRegisterForm();

  const { canSubmit, fieldErrors } = useRegisterValidation(formData, actionData);

  return (
    <Form method="post" className="space-y-4">
      <input type="hidden" name="intent" value="register" />

      {actionData?.error && <StatusMessage type="error" message={actionData.error} />}
      {showSuccess && <StatusMessage type="success" message={String(actionData?.message)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <AuthInput
            name="full_name"
            label="Nom complet"
            icon={User}
            type="text"
            placeholder="Ex: John Doe"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
          {fieldErrors.full_name && (
            <span className="text-error text-xs ml-1">{fieldErrors.full_name}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <AuthInput
            name="username"
            label="Nom d'utilisateur"
            icon={AtSign}
            type="text"
            placeholder="Ex: Doe"
            value={formData.username}
            onChange={handleChange}
            required
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
          {fieldErrors.username && (
            <span className="text-error text-xs ml-1">{fieldErrors.username}</span>
          )}
        </div>
      </div>

      <RoleSelector value={formData.role} onChange={handleChange} />

      <div className="flex flex-col gap-1">
        <AuthInput
          name="email"
          label="Email"
          icon={Mail}
          type="email"
          placeholder="Ex: johndoe@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {fieldErrors.email && (
          <span className="text-error text-xs ml-1">{fieldErrors.email}</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PasswordField
          name="password"
          label="Mot de passe"
          placeholder="8+ caractères, 1 chiffre"
          value={formData.password}
          showPassword={showPassword}
          isSubmitting={isSubmitting}
          error={fieldErrors.password}
          onChange={handleChange}
          onToggleVisibility={toggleShowPassword}
        />
        <PasswordField
          name="confirmPassword"
          label="Confirmer le mot de passe"
          placeholder="Répétez le mot de passe"
          value={formData.confirmPassword}
          showPassword={showPassword}
          isSubmitting={isSubmitting}
          error={fieldErrors.confirmPassword}
          onChange={handleChange}
        />
      </div>

      <AcceptanceCheckbox checked={formData.accepted} onChange={handleChange} />

      <AuthButton
        label="Créer mon compte"
        isLoading={isSubmitting}
        icon={UserPlus}
        variant="primary"
        disabled={!canSubmit}
      />
    </Form>
  );
}
