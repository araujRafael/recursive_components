import React, { useReducer } from 'react';
import CommentTextArea from '../CommentTextArea';
import { initialReducerActComments, ReducerActComments } from './Reducer';
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
  const TIME_PASSED = new Date().getTime() - new Date(comment.createdAt)
    .getTime() > FIVE_MIN
  const canReply = currentUserId !== comment.userId
  const canEdit = currentUserId === comment.userId && !TIME_PASSED
  const canDelete = currentUserId === comment.userId && !TIME_PASSED
  // Data *************************************************************
  const { avatar, username, createdAt, body, parentId, id, userId } = comment
  const created = new Date(createdAt).toLocaleDateString()
  // Reducer *********************************************************
  const [stateAction, dispatchAction] =
    useReducer(ReducerActComments, initialReducerActComments)
  // State *********************************************************

  // fn ***********************************************************


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
        {stateAction.show && <CommentTextArea submitLabel={stateAction.label}
          handleSubmit={(text) => {
            if (stateAction.label === "Reply") {
              onReply(text, comment.id)
              dispatchAction("REPLY")
            }
            if (stateAction.label === "Edit") {
              onEdit({ ...comment, body: text }, comment.id)
              dispatchAction("EDIT")
            }
          }} />}
        <div className="actions">
          {canReply &&
            <p className='action' onClick={() => dispatchAction("REPLY")}>
              Reply
            </p>}
          {canEdit &&
            <p className='action' onClick={() => dispatchAction("EDIT")}>
              Edit
            </p>}
          {canDelete &&
            <p className='action' onClick={() => onDelete(comment.id)}>
              Delete
            </p>}
        </div>
      </div>
      {/**
       * Get replies from db
       * Here that magic happen
      */}
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