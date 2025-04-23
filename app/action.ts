'use server'

import z from "zod"

const checkEmail = (email: string) => email.endsWith("@zod.com")

const formSchema = z.object({
  username: z.string().min(5, "5글자 이상 입력해주세요."),
  email: z.string().email().refine(checkEmail, {
    message: "@zod.com 형식으로만 가능합니다.",
  }),
  password: z
    .string()
    .min(10, "10글자 이상 입력해주세요.")
    .regex(/\d/, "숫자를 최소 1개 이상 포함해야 합니다."),
})

interface FormSuccess {
  success: true;
}

interface FormError {
  fieldErrors: {
    username?: string[];
    email?: string[];
    password?: string[];
  };
  formErrors?: string[];
}

type FormResult = FormSuccess | FormError;

export async function handleForm(
  prevState: any,
  formData: FormData
): Promise<FormResult> {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password")
  };

  const result = formSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten() as FormError;
  }

  return {
    success: true,
  };
}
