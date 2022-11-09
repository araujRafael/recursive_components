import React, { FormEvent, useState } from 'react';

import './styles.css';

interface CommentTextAreaProps {
  submitLabel: string
  handleSubmit(text: string): void
}

const CommentTextArea: React.FC<CommentTextAreaProps> = ({
  submitLabel, handleSubmit
}) => {
  // state *************************************************************
  const [text, setText] = useState<string>("")
  // Config ***********************************************************
  const isDisableBtn = text.length === 0

  // fn
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSubmit(text)
    setText("")
  }

  // render
  return (
    <form onSubmit={onSubmit}>
      <textarea placeholder={`Write comment.`}
        value={text} onChange={e => setText(e.target.value)} />
      <button type='submit' disabled={isDisableBtn} >
        {submitLabel}
      </button>
    </form>
  );
}

export default CommentTextArea;