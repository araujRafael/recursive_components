import { useEffect, useState } from "react";
import Comments, { DataComment } from "./components/Comments";
import CommentTextArea from "./components/CommentTextArea";

function App() {
  // Config Data *******************************************************
  /**
   * imagine that the userId come from db
   */
  Math.floor(Math.random() * 3)
  const currentUserId = "1"
  // API *********************************************************
  const MOCK_API = process.env.REACT_APP_MOCK_API
  const ENDPOINT = "comments"
  const URL_API = `${MOCK_API}${ENDPOINT}`
  // State ************************************************************
  const [data, setData] = useState<DataComment[]>([])

  /**
   * Bring me comments that haven't parentId and sort `ASC`
  */
  const rootComments = data
    .filter(x => !x.parentId)
    .sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  /**
   * Get replies and sort => `ASC`
   * @param commentId id of the documnet
   * @returns DataComments[]
   */
  const getReplies = (commentId: string) => data
    .filter(x => x.parentId === commentId)
    .sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  // Fetch Data *******************************************************
  useEffect(() => {
    getComments()
  }, [])

  // fn ************************************************************
  const getComments = async () => {
    const resp = await fetch(URL_API)
    const json = await resp.json()
    setData(await json)
  }
  const addComment = async (text: string, parentId?: string) => {
    // USER *********************************************************
    const JHON_DATA: DataComment = {
      id: Math.random().toString(36).substring(2, 9),
      body: "",
      parentId: null,
      avatar: "",
      userId: "1",
      username: "Jhon",
      createdAt: new Date().toISOString()
    }
    // ...
    const body = JSON.stringify({
      ...JHON_DATA,
      body: text, parentId: parentId ? parentId : null
    })
    // 
    try {
      const resp = await fetch(URL_API, {
        method: "POST", body,
        headers: { "Content-Type": "application/json" }
      },)
      const json = await resp.json()
      if (resp.ok) {
        setData([...data, json])
      }
    } catch (err) {
      console.log(err);
    }
  }
  // "on<Anything>" is actions from Comment::Component
  const onDelete = async (id: string) => {
    try {
      const resp = await fetch(URL_API + `/${id}`, {
        method: "DELETE"
      })
      getComments()
    } catch (err) {
      console.log(err);
    }
  }
  const onEdit = async (obj: object, id: string,) => {
    const newData = JSON.stringify(obj)
    try {
      const resp = await fetch(URL_API + `/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: newData
      })
      if (resp.ok) {
        getComments()
      } else {
        console.log(resp);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Render ************************************************************
  return (
    <div>
      <h1>Recursive Components</h1>
      <h2 style={{ margin: 5 }}>Hi, Jhon 👋 </h2>
      <CommentTextArea submitLabel="Send Comment" handleSubmit={addComment} />
      {
        rootComments?.map(x => {
          return <Comments
            key={x.id}
            comment={x}
            replies={getReplies(x.id)}
            currentUserId={currentUserId}
            onDelete={(id) => onDelete(id)}
            onEdit={(data, id) => onEdit(data, id!,)}
            onReply={addComment}
          />
        })
      }
    </div>
  );
}

export default App;
