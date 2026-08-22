import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets/assets'
import Sidebar from '../../components/admin/Sidebar'

const Layout = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen'>
      <div className='flex items-center justify-between py-3 px-4 sm:px-12 border-b border-gray-200'>
        <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className='w-32 sm:w-40 cursor-pointer' />
        <button className='text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer'>Logout</button>
      </div>
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
