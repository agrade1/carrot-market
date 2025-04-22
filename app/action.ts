'use server'

export async function handleForm(
  _: any,
  formData: FormData
) {
  const password = formData.get('password')
  const username = formData.get('username')

  if (password !== '12345') {
    return { errors: ['비밀번호가 틀렸습니다.'] }
  }

  return { errors: [], successMessage: `${username}님, 환영합니다!` }
}
