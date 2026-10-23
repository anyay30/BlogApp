import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const AuthPage = ({ mode }) => {
  const isSignup = mode === 'signup'
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')

    if (isSignup && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const endpoint = isSignup ? 'register' : 'login'
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || (isSignup ? 'Could not create your account.' : 'Could not sign in.'))
      }

      localStorage.setItem('blogUserToken', data.token)
      localStorage.setItem('blogUser', JSON.stringify(data.user))
      navigate('/', { replace: true })
    } catch (requestError) {
      setError(requestError.message === 'Failed to fetch'
        ? 'Could not reach the server. Check your connection and try again.'
        : requestError.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex flex-1 items-center justify-center px-5 py-12'>
        <section className='w-full max-w-md rounded-xl border border-primary/20 bg-white p-7 shadow-xl shadow-primary/10 sm:p-9'>
          <h1 className='text-center text-3xl font-semibold text-gray-800'>
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className='mt-2 text-center text-sm text-gray-500'>
            {isSignup ? 'Join SmartBlog to get started.' : 'Sign in to your SmartBlog account.'}
          </p>

          <form onSubmit={submit} className='mt-7 flex flex-col gap-4'>
            {isSignup && (
              <label className='flex flex-col gap-1 text-sm text-gray-700'>
                Name
                <input
                  autoComplete='name'
                  required
                  minLength={2}
                  maxLength={80}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className='rounded border border-gray-300 px-3 py-2.5 outline-none focus:border-primary'
                  placeholder='Your name'
                />
              </label>
            )}

            <label className='flex flex-col gap-1 text-sm text-gray-700'>
              Email
              <input
                type='email'
                autoComplete='email'
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className='rounded border border-gray-300 px-3 py-2.5 outline-none focus:border-primary'
                placeholder='you@example.com'
              />
            </label>

            <label className='flex flex-col gap-1 text-sm text-gray-700'>
              Password
              <input
                type='password'
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                required
                minLength={isSignup ? 8 : 1}
                maxLength={72}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className='rounded border border-gray-300 px-3 py-2.5 outline-none focus:border-primary'
                placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
              />
            </label>

            {isSignup && (
              <label className='flex flex-col gap-1 text-sm text-gray-700'>
                Confirm password
                <input
                  type='password'
                  autoComplete='new-password'
                  required
                  minLength={8}
                  maxLength={72}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className='rounded border border-gray-300 px-3 py-2.5 outline-none focus:border-primary'
                  placeholder='Enter your password again'
                />
              </label>
            )}

            {error && <p className='text-sm text-red-600' role='alert'>{error}</p>}

            <button
              type='submit'
              disabled={loading}
              className='mt-2 rounded bg-primary px-5 py-3 font-medium text-white cursor-pointer hover:bg-primary/90 disabled:opacity-60'
            >
              {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Login'}
            </button>
          </form>

          <p className='mt-6 text-center text-sm text-gray-600'>
            {isSignup ? 'Already have an account? ' : 'New to SmartBlog? '}
            <Link className='font-medium text-primary hover:underline' to={isSignup ? '/login' : '/signup'}>
              {isSignup ? 'Login' : 'Sign up'}
            </Link>
          </p>

          {!isSignup && (
            <p className='mt-3 text-center text-xs text-gray-500'>
              Admin? <Link className='text-primary hover:underline' to='/admin/login'>Sign in to the dashboard</Link>
            </p>
          )}
        </section>
      </main>
    </div>
  )
}

export default AuthPage
