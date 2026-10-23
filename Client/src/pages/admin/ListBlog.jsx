import { useEffect, useState } from 'react'
import BlogTable from './BlogTable'

const ListBlog = () => {

  const [blogs, setBlogs] = useState([])

  const fetchBlogs = async () => {

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/blogs`
      )

      const data = await response.json()

      if (data.success) {
        setBlogs(data.blogs)
      }

    } catch (error) {

      console.error('Error fetching blogs:', error)

    }
  }

  useEffect(() => {
    // The state update happens after the asynchronous network response.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBlogs()
  }, [])

  return (

    <div>

      <h1 className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
        All blogs
      </h1>

      <div className='relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>

        <table className='w-full text-sm text-gray-500'>

          <thead className='text-xs text-gray-600 text-left uppercase'>

            <tr>

              <th className='px-2 py-4'>
                #
              </th>

              <th className='px-2 py-4'>
                Blog Title
              </th>

              <th className='px-2 py-4 max-sm:hidden'>
                Date
              </th>

              <th className='px-2 py-4 max-sm:hidden'>
                Status
              </th>

              <th className='px-2 py-4'>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {blogs.map((blog, index) => (

              <BlogTable
                key={blog._id}
                blog={blog}
                fetchBlogs={fetchBlogs}
                index={index + 1}
              />

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default ListBlog
