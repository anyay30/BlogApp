import { assets } from '../../assets/assets/assets'

const BlogTable = ({ blog, fetchBlogs, index }) => {

  const { title, createdAt, _id } = blog

  const BlogDate = new Date(createdAt)

  // Publish / Unpublish
  const togglePublish = async () => {
    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/blogs/${_id}`,
        {
          method: 'PUT',
          headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
},
          body: JSON.stringify({
            isPublished: !blog.isPublished
          })
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update blog')
      }

      // Refresh blogs
      fetchBlogs()

    } catch (error) {

      console.error('Publish error:', error)
      alert(error.message)

    }
  }


  // Delete blog
  const deleteBlog = async () => {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this blog?'
    )

    if (!confirmDelete) return

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/blogs/${_id}`,
       {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
  }
}
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete blog')
      }

      // Refresh blogs
      fetchBlogs()

    } catch (error) {

      console.error('Delete error:', error)
      alert(error.message)

    }
  }


  return (
    <tr className='border-y border-gray-300'>

      <th className='px-2 py-4'>
        {index}
      </th>

      <td className='px-2 py-4'>
        {title}
      </td>

      <td className='px-2 py-4 max-sm:hidden'>
        {BlogDate.toDateString()}
      </td>

      <td className='px-2 py-4 max-sm:hidden'>

        <p
          className={
            blog.isPublished
              ? 'text-green-600'
              : 'text-orange-700'
          }
        >
          {blog.isPublished
            ? 'Published'
            : 'Unpublished'}
        </p>

      </td>

      <td className='px-2 py-4 flex text-xs gap-3'>

        <button
          onClick={togglePublish}
          className='border px-2 py-0.5 mt-1 rounded cursor-pointer'
        >
          {blog.isPublished
            ? 'Unpublish'
            : 'Publish'}
        </button>

        <img
          onClick={deleteBlog}
          src={assets.cross_icon}
          className='w-8 hover:scale-110 transition-all cursor-pointer'
          alt='Delete'
        />

      </td>

    </tr>
  )
}

export default BlogTable
