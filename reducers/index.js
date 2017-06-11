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
    case AppActions.RECEIVE_MIXES:
      return Object.assign({}, state, {
        mixes: action.payload
      })
    case AppActions.GOOGLE_HAS_LOADED:
      return Object.assign({}, state, {
        googleLoaded: action.payload
      })
    default:
      return state
  }
}

export default app
