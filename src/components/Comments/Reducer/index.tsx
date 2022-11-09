
export const initialReducerActComments = {
  label: "",
  show: false
}
type initialActionType = typeof initialReducerActComments


export const ReducerActComments = (
  state: initialActionType, action: "REPLY" | "EDIT"
) => {
  switch (action) {
    case "EDIT": {
      if (state.label === "Reply" && state.show) {
        return { label: "Edit", show: state.show }
      }
      return { label: "Edit", show: !state.show }
    }
    case "REPLY": {
      if (state.label === "Edit" && state.show) {
        return { label: "Reply", show: state.show }
      }
      return { label: "Reply", show: !state.show }
    }
    default: {
      return state
    }
  }
}