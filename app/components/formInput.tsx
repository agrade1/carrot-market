'use client'

import { InputHTMLAttributes } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  errors: string[]
}

export default function FormInput({ errors, ...props }: FormInputProps) {
  const hasError = errors.length > 0

  return (
    <div className="flex flex-col gap-1">
      <input
        {...props}
        className={`bg-transparent rounded-md w-full h-10 px-3 outline-none ring-2 transition
          placeholder:text-neutral-400
          ${hasError ? 'ring-red-500 focus:ring-red-500' : 'ring-neutral-200 focus:ring-orange-500'}
        `}
      />
      {hasError &&
        errors.map((error, index) => (
          <span key={index} className="text-red-500 text-sm font-medium">
            {error}
          </span>
        ))}
    </div>
  )
}
