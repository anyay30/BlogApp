import { useEffect, useState } from 'react'
import { assets } from '../../assets/assets/assets'
import BlogTable from './BlogTable'

const Dashboard = () => {

  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: []
  })

  const fetchDashboard = async () => {

    try {

      // Fetch blogs
      const blogsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/blogs`
      )

      const blogsResult = await blogsResponse.json()

      // Fetch comments
      const commentsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/comments`
      )

      const commentsResult = await commentsResponse.json()

      if (blogsResult.success && commentsResult.success) {

        const blogs = blogsResult.blogs
        const comments = commentsResult.comments

        setDashboardData({
          blogs: blogs.length,

          comments: comments.length,

          drafts: blogs.filter(
            blog => !blog.isPublished
          ).length,

          recentBlogs: blogs.slice(0, 5)
        })
      }

    } catch (error) {

      console.error(
        'Error fetching dashboard data:',
        error
      )

    }
  }


  useEffect(() => {
    // The state update happens after asynchronous network responses.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard()
  }, [])


  return (

    <div className='flex-1 p-4 md:p-10 bg-blue-50/50'>

      {/* Dashboard Cards */}

      <div className='flex flex-wrap gap-4'>

        {/* Blogs */}

        <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>

          <img
            src={assets.dashboard_icon_1}
            alt=''
          />

          <div>

            <p className='text-xl font-semibold text-gray-600'>
              {dashboardData.blogs}
            </p>

            <p className='text-gray-400 font-light'>
              Blogs
            </p>

          </div>

        </div>


        {/* Comments */}

        <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>

          <img
            src={assets.dashboard_icon_2}
            alt=''
          />

          <div>

            <p className='text-xl font-semibold text-gray-600'>
              {dashboardData.comments}
            </p>

            <p className='text-gray-400 font-light'>
              Comments
            </p>

          </div>

        </div>


        {/* Drafts */}

        <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>

          <img
            src={assets.dashboard_icon_3}
            alt=''
          />

          <div>

            <p className='text-xl font-semibold text-gray-600'>
              {dashboardData.drafts}
            </p>

            <p className='text-gray-400 font-light'>
              Drafts
            </p>

          </div>

        </div>

      </div>


      {/* Latest Blogs */}

      <div>

        <div className='flex items-center gap-3 m-4 mt-6 text-gray-600'>

          <img
            src={assets.dashboard_icon_4}
            alt=''
          />

          <p>
            Latest blogs
          </p>

        </div>


        <div className='relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>

          <table className='w-full text-sm text-gray-500'>

            <thead className='text-xs text-gray-600 text-left uppercase'>

              <tr>

                <th
                  scope='col'
                  className='px-2 py-4 sm:px-6'
                >
                  #
                </th>

                <th
                  scope='col'
                  className='px-2 py-4'
                >
                  Blog Title
                </th>

                <th
                  scope='col'
                  className='px-2 py-4 max-sm:hidden'
                >
                  Date
                </th>

                <th
                  scope='col'
                  className='px-2 py-4 max-sm:hidden'
                >
                  Status
                </th>

                <th
                  scope='col'
                  className='px-2 py-4'
                >
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {dashboardData.recentBlogs.map(
                (blog, index) => (

                  <BlogTable
                    key={blog._id}
                    blog={blog}
                    fetchBlogs={fetchDashboard}
                    index={index + 1}
                  />

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )
}

export default Dashboard
