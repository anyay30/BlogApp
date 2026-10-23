import { useEffect, useState } from 'react'
import { blogCategories } from '../assets/assets/assets'
import { motion } from 'motion/react'
import BlogCard from './BlogCard'

const BlogList = () => {

  const [menu, setMenu] = useState('All')
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs`)

      const data = await response.json()

      if (data.success) {
        setBlogs(data.blogs)
      }

    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // The state update happens after the asynchronous network response.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBlogs()
  }, [])

  const filteredBlogs = blogs.filter((blog) =>
    menu === 'All' ? true : blog.category === menu
  )

  return (
    <div>

      {/* Categories */}

      <div className='flex justify-center gap-4 sm:gap-8 my-10 relative'>

        {blogCategories.map((item) => (

          <div key={item} className='relative'>

            <button
              type='button'
              onClick={() => setMenu(item)}
              className={`cursor-pointer text-gray-500 ${
                menu === item
                  ? 'text-white px-4 pt-0.5'
                  : ''
              }`}
            >

              {item}

              {menu === item && (
                <motion.div
                  layoutId='underline'
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30
                  }}
                  className='absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full'
                />
              )}

            </button>

          </div>

        ))}

      </div>


      {/* Blogs */}

      {loading ? (

        <p className='text-center my-20'>
          Loading blogs...
        </p>

      ) : (

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40'>

          {filteredBlogs.map((blog) => (

            <BlogCard
              key={blog._id}
              blog={blog}
            />

          ))}

        </div>

      )}

    </div>
  )
}

export default BlogList
