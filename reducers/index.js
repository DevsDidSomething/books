import * as AppActions from "../actions/index"

//TODO why does this initial state get overwritten?
const app = (state = {searchResults: [], books: []}, action) => {
  switch (action.type) {
    case AppActions.GET_SEARCH_RESULTS:
      return Object.assign({}, state, {
        searchResults: action.payload
      })
    case AppActions.RECEIVE_BOOKS:
      return Object.assign({}, state, {
        books: action.payload
      })
    default:
      return state
  }
}

export default app
