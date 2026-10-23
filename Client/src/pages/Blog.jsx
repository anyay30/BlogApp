import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets/assets'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Moment from 'moment'

const Blog = () => {

  const { id } = useParams()

  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])

  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  // Fetch single blog from MongoDB
  const fetchBlogData = useCallback(async () => {

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/blogs/${id}`
      )

      const result = await response.json()

      if (result.success) {
        setData(result.blog)
      } else {
        console.error(result.message)
      }

    } catch (error) {

      console.error('Error fetching blog:', error)

    }
  }, [id])


  // Comments will be connected to MongoDB later
const fetchComments = useCallback(async () => {

  try {

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/comments/blog/${id}`
    )

    const result = await response.json()

    if (result.success) {
      setComments(result.comments)
    } else {
      console.error(result.message)
    }

  } catch (error) {

    console.error('Error fetching comments:', error)

  }

}, [id])


const addComment = async (e) => {
  e.preventDefault()

  try {

    const response = await fetch(
     `${import.meta.env.VITE_API_URL}/api/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          blog: id,
          name,
          content
        })
      }
    )

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || 'Failed to add comment'
      )
    }

    alert('Comment submitted successfully! It will appear after approval.')

    setName('')
    setContent('')

  } catch (error) {

    console.error('Comment error:', error)

    alert(error.message || 'Something went wrong')

  }
}


  useEffect(() => {

    // The state updates happen after the asynchronous network responses.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBlogData()
    fetchComments()

  }, [id, fetchBlogData, fetchComments])


  if (!data) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        Loading blog...
      </div>
    )
  }


  return (

    <div className='relative'>

      <img
        src={assets.gradientBackground}
        alt=''
        className='absolute -top-50 -z-1 opacity-50'
      />

      <Navbar />


      {/* Blog Header */}

      <div className='text-center mt-20 text-gray-600'>

        <p className='text-primary py-4 font-medium'>
          Published on {Moment(data.createdAt).format('MMMM Do YYYY')}
        </p>

        <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>
          {data.title}
        </h1>

        <h2 className='my-5 max-w-lg mx-auto'>
          {data.subTitle}
        </h2>

        <p className='inline-block py-1 px-4 rounded-full mb-6 border border-primary/35 bg-primary/5 font-medium text-primary'>
          {data.category}
        </p>

      </div>


      {/* Blog Content */}

      <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>

        <img
          src={data.image}
          alt={data.title}
          className='rounded-3xl mb-5 w-full'
        />


        <div
          className='rich-text max-w-3xl mx-auto'
          dangerouslySetInnerHTML={{
            __html: data.description
          }}
        />


        {/* Comments */}

        <div className='mt-14 mb-10 max-w-3xl mx-auto'>

          <p className='font-semibold mb-4'>
            Comments ({comments.length})
          </p>

          {comments.length === 0 ? (

            <p className='text-gray-500 text-sm'>
              No comments yet.
            </p>

          ) : (

            <div className='flex flex-col gap-4'>

              {comments.map((item, index) => (

                <div
                  key={index}
                  className='relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600'
                >

                  <div className='flex items-center gap-2 mb-2'>

                    <img
                      src={assets.user_icon}
                      alt=''
                      className='w-6'
                    />

                    <p className='font-medium'>
                      {item.name}
                    </p>

                  </div>

                  <p className='text-sm max-w-md ml-8'>
                    {item.content}
                  </p>

                  <div className='text-xs ml-8 mt-2'>
                    {Moment(item.createdAt).fromNow()}
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* Add Comment */}

        <div className='max-w-3xl mx-auto'>

          <p className='font-semibold mb-4'>
            Add your comment
          </p>

          <form
            onSubmit={addComment}
            className='flex flex-col items-start gap-4 max-w-lg'
          >

            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type='text'
              placeholder='Name'
              required
              className='w-full p-2 border border-gray-300 rounded outline-none'
            />


            <textarea
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder='Comment'
              required
              className='w-full p-2 border border-gray-300 rounded outline-none h-48'
            />


            <button
              type='submit'
              className='bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer'
            >
              Submit
            </button>

          </form>

        </div>


        {/* Share */}

        <div className='my-24 max-w-3xl mx-auto'>

          <p className='font-semibold my-4'>
            Share this article on social media
          </p>

          <div className='flex'>

            <img
              src={assets.facebook_icon}
              width={50}
              alt=''
            />

            <img
              src={assets.twitter_icon}
              width={50}
              alt=''
            />

            <img
              src={assets.googleplus_icon}
              width={50}
              alt=''
            />

          </div>

        </div>

      </div>


      <Footer />

    </div>
  )
}

export default Blog
