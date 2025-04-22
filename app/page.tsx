'use client'

import { handleForm } from "./action"
import FormInput from "./components/formInput"
import FormButton from "./components/formBtn"
import { useActionState, useOptimistic, useRef, useState, useTransition } from "react"




export default function LogIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")

  const [state, action] = useActionState(handleForm, null)

  return (
    <div className="h-screen flex flex-col gap-10 py-8 px-6 max-w-[800px] mx-auto m-auto">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email, username and password.</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          errors={[]}
        />
        <FormInput
          name="username"
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          errors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          errors={state?.errors ?? []}
        />
        <FormButton text={'Log in'}/>
        {state?.successMessage && (
          <div className="mt-2 rounded bg-green-500 px-4 py-2 text-white font-semibold text-sm text-center">
            {state.successMessage}
          </div>
        )}
      </form>
    </div>
  )
}