"use server";

import { z } from "zod";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_ERROR,
  PASSWORD_CONTAINS_NUMBER,
  PASSWORD_NUMBER_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkEmail = (email: string) => email.endsWith("@zod.com");

const formSchema = z.object({
  email: z.string().email().refine(checkEmail, {
    message: "@zod.com 형식으로만 가능합니다.",
  }),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR)
    .regex(PASSWORD_CONTAINS_NUMBER, PASSWORD_NUMBER_ERROR),
});

interface FormSuccess {
  success: true;
}

interface FormError {
  fieldErrors: {
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
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // 1. Zod로 1차 폼 검증
  const result = formSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten() as FormError;
  }

  // 2. 이메일로 유저 찾기
  const user = await db.user.findUnique({
    where: {
      email: result.data.email,
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    return {
      fieldErrors: {
        email: ["등록되지 않은 이메일입니다."],
      },
    };
  }

  // 3. 비밀번호 비교
  const passwordOk = await bcrypt.compare(
    result.data.password,
    user.password ?? "xxxx"
  );

  if (!passwordOk) {
    return {
      fieldErrors: {
        password: ["비밀번호가 일치하지 않습니다."],
      },
    };
  }

  // 4. 세션 저장
  const session = await getSession();
  session.id = user.id;
  await session.save();
  redirect("/profile");
}
