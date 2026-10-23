import { Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Blog from './pages/Blog'

import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddBlog from './pages/admin/AddBlog'
import ListBlog from './pages/admin/ListBlog'
import Comments from './pages/admin/Comments'
import ProtectedRoute from './components/admin/ProtectedRoute'

import Login from './components/admin/Login'
import AuthPage from './pages/AuthPage'

import 'quill/dist/quill.snow.css'


const App = () => {

  return (
    <div>

      <Routes>

        {/* Public routes */}

        <Route
          path='/'
          element={<Home />}
        />

        <Route
          path='/blog/:id'
          element={<Blog />}
        />

        <Route path='/login' element={<AuthPage mode='login' />} />
        <Route path='/signup' element={<AuthPage mode='signup' />} />


        {/* Admin Login */}

        <Route
          path='/admin/login'
          element={<Login />}
        />


        {/* Admin */}

       <Route
  path='/admin'
  element={
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  }
>

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path='addBlog'
            element={<AddBlog />}
          />

          <Route
            path='listBlog'
            element={<ListBlog />}
          />

          <Route
            path='comments'
            element={<Comments />}
          />

        </Route>

      </Routes>

    </div>
  )
}

export default App
