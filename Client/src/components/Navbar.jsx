import { useState } from 'react'
import { assets } from '../assets/assets/assets'
import { useNavigate } from 'react-router-dom'

const readCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('blogUser') || 'null')
  } catch {
    return null
  }
}

const Navbar = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(readCurrentUser)

    const logout = () => {
      localStorage.removeItem('blogUser')
      localStorage.removeItem('blogUserToken')
      setUser(null)
    }

  return (
    <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt='SmartBlog home'
        className='w-32 sm:w-44 cursor-pointer'
      />

      <div className='flex items-center gap-2 sm:gap-3'>
        {user ? (
          <>
            <span className='hidden sm:inline text-sm text-gray-700'>Hi, {user.name}</span>
            <button
              onClick={logout}
              className='rounded-full border border-primary px-5 sm:px-7 py-2 text-sm text-primary cursor-pointer hover:bg-primary/5'
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className='rounded-full border border-primary px-5 sm:px-7 py-2 text-sm text-primary cursor-pointer hover:bg-primary/5'
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className='flex items-center gap-2 rounded-full bg-primary px-5 sm:px-7 py-2 text-sm text-white cursor-pointer hover:bg-primary/90'
            >
              Sign up
              <img src={assets.arrow} className='w-3' alt='' />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default  Navbar
