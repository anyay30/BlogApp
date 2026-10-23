import { assets } from '../../assets/assets/assets'

const CommentTableItem = ({
  comment,
  fetchComments
}) => {

  const blogTitle = comment.blog?.title || 'Deleted Blog'


  // Approve / Unapprove
  const toggleApproval = async () => {

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/comments/${comment._id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Failed to update comment'
        )
      }

      fetchComments()

    } catch (error) {

      console.error('Approval error:', error)

      alert(error.message)

    }
  }


  // Delete comment
  const deleteComment = async () => {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this comment?'
    )

    if (!confirmDelete) return

    try {

      const response = await fetch(
       `${import.meta.env.VITE_API_URL}/api/comments/${comment._id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Failed to delete comment'
        )
      }

      fetchComments()

    } catch (error) {

      console.error('Delete comment error:', error)

      alert(error.message)

    }
  }


  const commentDate = new Date(comment.createdAt)


  return (

    <tr className='border-y border-gray-300'>

      <td className='px-6 py-4'>

        <b className='font-medium text-gray-600'>
          Blog
        </b>
        : {blogTitle}

        <br />

        <b className='font-medium text-gray-600'>
          Name
        </b>
        : {comment.name}

        <br />

        <b className='font-medium text-gray-600'>
          Comment
        </b>
        : {comment.content}

      </td>


      <td className='px-6 py-4 max-sm:hidden'>

        {commentDate.toLocaleDateString()}

      </td>


      <td className='px-6 py-4'>

        <div className='inline-flex items-center gap-4'>

          {!comment.isApproved ? (

            <img
              onClick={toggleApproval}
              src={assets.tick_icon}
              alt='Approve'
              className='w-5 hover:scale-110 transition-all cursor-pointer'
            />

          ) : (

            <button
              onClick={toggleApproval}
              className='text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1 cursor-pointer'
            >
              Approved
            </button>

          )}


          <img
            onClick={deleteComment}
            src={assets.bin_icon}
            alt='Delete'
            className='w-5 hover:scale-110 transition-all cursor-pointer'
          />

        </div>

      </td>

    </tr>
  )
}

export default CommentTableItem
