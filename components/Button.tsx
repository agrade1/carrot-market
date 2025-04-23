'use client'

import { useFormStatus } from "react-dom"

interface Props {
  text: string
}

export default function FormButton({ text }: Props) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 h-10 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-600 transition disabled:opacity-50"
    >
      {pending ? "처리 중..." : text}
    </button>
  )
}
