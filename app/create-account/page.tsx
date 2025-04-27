'use client'

import { useState, useEffect } from "react"
import { useActionState } from "react"
import Input from "@/components/Input"
import Button from "@/components/Button"
import { useFormError } from "@/hooks/useFormError"
import "@/lib/db"
import { createAccount } from "./action"


export default function LogIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPW, setconfirmPW] = useState("")
  const [username, setUsername] = useState("")
  const [state, action] = useActionState(createAccount, null)

  const fieldErrors = useFormError(state)

  return (
    <div className="flex items-center justify-between min-h-screen p-6 max-w-[600px] mx-auto py-10">

      <form action={action} className="flex flex-col gap-3 w-full">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          errors={fieldErrors.email ?? []}
        />
        <Input
          name="username"
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          errors={fieldErrors.username ?? []}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          errors={fieldErrors.password ?? []}
        />
        <Input
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          required
          value={confirmPW}
          onChange={(e) => setconfirmPW(e.target.value)}
          errors={fieldErrors.confirm_password ?? []}
        />
        <Button text="Log in" />
      </form>
    </div>
  )
}
