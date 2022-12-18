import { signIn } from 'next-auth/react'

export default function LoginBtn() {
  function handleLogin(e: any) {
    e.preventDefault()

    signIn('auth0')
  }

  return (
    <>
      Not signed in <br />
      <button onClick={(e) => handleLogin(e)}>Sign in</button>
    </>
  )
}
