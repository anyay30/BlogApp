import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets/assets'
import Sidebar from '../../components/admin/Sidebar'

const Layout = () => {

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  return (
    <div className='min-h-screen'>

      {/* Top Navbar */}
      <div className='flex items-center justify-between py-3 px-4 sm:px-12 border-b border-gray-200'>

        {/* Logo */}
        <img
          onClick={() => navigate('/')}
          src={assets.logo}
          alt="logo"
          className='w-32 sm:w-40 cursor-pointer'
        />

        {/* Right Side Buttons */}
        <div className='flex items-center gap-4'>

          {/* Home Button */}
          <button
            onClick={() => navigate('/')}
            className='text-sm px-6 py-2 border border-primary text-primary rounded-full cursor-pointer hover:bg-primary hover:text-white transition-all'
          >
            Home
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className='text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-all'
          >
            Logout
          </button>

        </div>

      </div>

      {/* Admin Content */}
      <div className='flex h-[calc(100vh-65px)]'>

        <Sidebar />

        <main className='flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:p-8'>
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default Layout
