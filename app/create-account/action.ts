"use server";

import db from "@/lib/db";
import bcrypt from "bcrypt";
import { z } from "zod";
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MIN_LENGTH_ERROR,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_ERROR,
  PASSWORD_CONTAINS_NUMBER,
  PASSWORD_NUMBER_ERROR,
} from "@/lib/constants";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

// 이메일 형식 검사
const checkEmail = (email: string) => email.endsWith("@zod.com");

// 유저네임 중복 검사
const checkUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

// 이메일 중복 검사
const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

const formSchema = z
  .object({
    username: z
      .string()
      .min(USERNAME_MIN_LENGTH, USERNAME_MIN_LENGTH_ERROR)
      .refine(checkUsername, { message: "이미 사용 중인 username입니다." }),
    email: z
      .string()
      .email({ message: "이메일 형식이 올바르지 않습니다." })
      .refine(checkEmail, { message: "@zod.com 형식으로만 가능합니다." })
      .refine(checkUniqueEmail, { message: "이미 등록된 이메일입니다." }),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR)
      .regex(PASSWORD_CONTAINS_NUMBER, PASSWORD_NUMBER_ERROR),
    confirm_password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR)
      .regex(PASSWORD_CONTAINS_NUMBER, PASSWORD_NUMBER_ERROR),
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    if (password !== confirm_password) {
      ctx.addIssue({
        code: "custom",
        path: ["confirm_password"],
        message: "비밀번호가 일치하지 않습니다.",
      });
    }
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  }

  const hashedPassword = await bcrypt.hash(result.data.password, 12);

  const user = await db.user.create({
    data: {
      username: result.data.username,
      email: result.data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
    },
  });

  const cookie = await getSession();
  cookie.id = user.id;
  await cookie.save();

  redirect("/profile");
}
