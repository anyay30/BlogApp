import { useEffect, useRef, useState } from 'react'
import { assets, blogCategories } from '../../assets/assets/assets'
import Quill from 'quill'
import { upload } from '@imagekit/javascript'

const AddBlog = () => {

  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const [image, setImage] = useState(null)
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [category, setCategory] = useState('Startup')
  const [isPublished, setIsPublished] = useState(false)

  const [loading, setLoading] = useState(false)
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [aiError, setAiError] = useState('')

  // Initialize Quill
  useEffect(() => {

    if (!quillRef.current && editorRef.current) {

      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow'
      })

    }

  }, [])


  // Upload image to ImageKit
  const uploadImage = async () => {

    if (!image) {
      throw new Error('Please select a thumbnail image')
    }

    // Get authentication parameters from our backend
    const authResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/api/imagekit`
    )

    if (!authResponse.ok) {
      throw new Error('Failed to authenticate with ImageKit')
    }

    const authData = await authResponse.json()

    // Upload image
    const result = await upload({
      file: image,
      fileName: image.name,

      publicKey: authData.publicKey,

      token: authData.token,
      signature: authData.signature,
      expire: authData.expire
    })

    return result.url
  }


  // Create blog
  const onSubmitHandler = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)

      // Get description from Quill
      const description = quillRef.current
        ? quillRef.current.root.innerHTML
        : ''

      if (!description || description === '<p><br></p>') {
        alert('Please enter blog description')
        setLoading(false)
        return
      }

      // Upload thumbnail
      const imageUrl = await uploadImage()

      // Send blog data to backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/blogs`,
        {
          method: 'POST',

         headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
},

          body: JSON.stringify({
            title,
            subTitle,
            description,
            category,
            image: imageUrl,
            isPublished
          })
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create blog')
      }

      alert('Blog created successfully!')

      // Reset form
      setTitle('')
      setSubTitle('')
      setCategory('Startup')
      setIsPublished(false)
      setImage(null)

      if (quillRef.current) {
        quillRef.current.setText('')
      }

    } catch (error) {

      console.error('Create blog error:', error)

      alert(error.message || 'Something went wrong')

    } finally {

      setLoading(false)

    }

  }


  // AI will be added next
const generateContent = async () => {

    if (!title.trim()) {
        alert("Please enter a blog title first")
        return
    }

    try {

        setIsGeneratingContent(true)
        setAiError('')

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/ai/generate`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    title,
                    subTitle,
                    category
                })
            }
        )

        const data = await response.json()

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Failed to generate content"
            )
        }

        // Put AI-generated HTML inside Quill
        if (quillRef.current) {
            quillRef.current.root.innerHTML = data.content
        }

        setAiError('')

    } catch (error) {

        setAiError(error.message === 'Failed to fetch'
          ? 'Could not reach the AI service. Check your connection and try again.'
          : error.message || 'The AI service could not generate content. Please try again.')

    } finally {

        setIsGeneratingContent(false)

    }
}


  return (

    <form
      onSubmit={onSubmitHandler}
      className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'
    >

      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>

        {/* Thumbnail */}

        <p>Upload thumbnail</p>

        <label htmlFor='image'>

          <img
            src={
              !image
                ? assets.upload_area
                : URL.createObjectURL(image)
            }
            alt=''
            className='mt-2 h-16 rounded cursor-pointer'
          />

          <input
            onChange={(e) => setImage(e.target.files[0])}
            type='file'
            id='image'
            accept='image/*'
            hidden
            required
          />

        </label>


        {/* Title */}

        <p className='mt-4'>Blog title</p>

        <input
          type='text'
          placeholder='Type here'
          required
          className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />


        {/* Subtitle */}

        <p className='mt-4'>Sub Title</p>

        <input
          type='text'
          placeholder='Type here'
          required
          className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded'
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
        />


        {/* Description */}

        <p className='mt-4'>Blog Description</p>

        <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>

          <div ref={editorRef}></div>

          <button
            type='button'
            onClick={generateContent}
            disabled={loading || isGeneratingContent}
            className='absolute bottom-1 right-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer disabled:opacity-50'
          >
            {isGeneratingContent ? 'Generating...' : aiError ? 'Try again' : 'Generate with AI'}
          </button>

        </div>

        {aiError && (
          <p className='max-w-lg mt-2 text-sm text-red-600' role='alert' aria-live='polite'>
            {aiError}
          </p>
        )}


        {/* Category */}

        <p className='mt-4'>Blog category</p>

        <select
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          name='category'
          className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded'
        >

          {blogCategories.map((item, index) => (
            <option
              key={index}
              value={item}
            >
              {item}
            </option>
          ))}

        </select>


        {/* Publish */}

        <div className='flex gap-2 mt-4'>

          <p>Publish Now</p>

          <input
            type='checkbox'
            checked={isPublished}
            className='scale-125 cursor-pointer'
            onChange={(e) => setIsPublished(e.target.checked)}
          />

        </div>


        {/* Submit */}

        <button
          type='submit'
          disabled={loading || isGeneratingContent}
          className='mt-6 bg-primary text-white px-6 py-2 rounded cursor-pointer disabled:opacity-50'
        >

          {loading ? 'Creating...' : 'Create Blog'}

        </button>

      </div>

    </form>
  )
}

export default AddBlog
