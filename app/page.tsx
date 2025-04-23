'use client'

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { handleForm } from "./action"
import Input from "../components/Input"
import Button from "../components/Button"
import { useFormError } from "../hooks/useFormError"

export default function LogIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [state, action] = useActionState(handleForm, null)

  const fieldErrors = useFormError(state)

  return (
    <form action={action} className="flex flex-col gap-3">
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
      <Button text="Log in" />
    </form>
  )
}
