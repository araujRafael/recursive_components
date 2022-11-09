import React, { useState } from 'react';
import CommentTextArea from '../CommentTextArea';
import './styles.css';

export interface DataComment {
  id: string,
  body: string,
  username: string,
  avatar?: string,
  userId: string,
  parentId: string | null,
  createdAt: string
}

interface CommentsProps {
  currentUserId: string
  comment: DataComment
  replies: DataComment[]
  // 
  onDelete(id: string): void
  onEdit(data: object, id: string): void
  onReply(text: string, parentId?: string): void
}

const Comments: React.FC<CommentsProps> = ({
  comment, replies, currentUserId, onDelete, onEdit, onReply
}) => {
  // Schema **********************************************************
  const FIVE_MIN = 1000 * 60 * 5
  const TIME_PASSED = new Date().getTime() - new Date(comment.createdAt).getTime() > FIVE_MIN
  const canReply = Boolean(currentUserId)
  const canEdit = currentUserId === comment.userId && !TIME_PASSED
  const canDelete = currentUserId === comment.userId && !TIME_PASSED
  // Data *************************************************************
  const { avatar, username, createdAt, body, parentId, id, userId } = comment
  const created = new Date(createdAt).toLocaleDateString()
  // State *********************************************************
  const [showReplay, setShowReplay] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  // fn ***********************************************************
  const handleShowReply = () => setShowReplay(st => !st)
  const handleShowEdit = () => setShowEdit(st => !st)


  // Render ********************************************************
  return <div className={`comment-container ${parentId !== null ? "" : "first-comment"}`}>
    <div className='avatar' >
      {avatar
        ? <img src={avatar} />
        : username?.substring(0, 1)}
    </div>
    <div className="wrap-head-body">
      <div className="header">
        {/*  */}
        <p className='username'>{username}</p>
        {/*  */}
        <p className='created-at'>{created}</p>
      </div>
      <div className='wrap-body-actions'>
        <p className="body">{body}</p>
        {showReplay && <CommentTextArea submitLabel='Reply' handleSubmit={(text) => onReply(text, comment.id)} />}
        {showEdit && <CommentTextArea submitLabel='Edit' handleSubmit={(text) => {
          onEdit({ ...comment, body: text }, comment.id)
          handleShowEdit()
        }} />}
        <div className="actions">
          {canReply && <p className='action' onClick={handleShowReply}>
            {showReplay ? "Cancel" : "Replay"}
          </p>}
          {canEdit && <p className='action' onClick={handleShowEdit}>
            Edit
          </p>}
          {canDelete && <p className='action' onClick={() => onDelete(comment.id)}>
            Delete
          </p>}
        </div>
      </div>
      {replies.length > 0 && (
        <div className="replies">
          {
            replies?.map(reply => (
              <Comments
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                replies={[]}
                onDelete={onDelete}
                onEdit={(data, id) => onEdit(data, id)}
                onReply={onReply}
              />
            ))
          }
        </div>
      )}
    </div>
  </div>;
}

export default Comments;