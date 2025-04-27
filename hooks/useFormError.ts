type FieldErrors = {
    username?: string[];
    email?: string[];
    password?: string[];
    confirm_password?: string[];
  };
  
  type FormErrorResult = {
    fieldErrors?: FieldErrors;
    formErrors?: string[];
  };
  
  export function useFormError(state: unknown): FieldErrors {
    if (state && typeof state === "object" && "fieldErrors" in state) {
      return (state as FormErrorResult).fieldErrors ?? {};
    }
    return {};
  }