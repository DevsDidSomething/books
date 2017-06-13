import { combineReducers } from 'redux'
import * as AppActions from "../actions/index"

const bookshelf = (state = {}, action) => {
  switch (action.type) {
    case AppActions.RECEIVE_BOOKSHELF:
      return action.payload
    case AppActions.RECEIVE_BOOKS:
      return Object.assign({}, state, {
        mix: {
          ...state.mix,
          Books: action.payload
        }
      })
    case AppActions.RECEIVE_MIXES:
      return Object.assign({}, state, {
        user: {
          ...state.user,
          Mixes: action.payload
        }
      })
    default:
      return state
  }
}
//TODO why does this initial state get overwritten?
const app = (state = {}, action) => {
  switch (action.type) {
    case AppActions.IS_FETCHING_BOOKSHELF:
      return Object.assign({}, state, {
        isFetchingBookshelf: action.payload
      })
    case AppActions.GET_SEARCH_RESULTS:
      return Object.assign({}, state, {
        searchResults: action.payload
      })
    case AppActions.RECEIVE_USER:
      return Object.assign({}, state, {
        user: action.payload
      })
    case AppActions.GOOGLE_HAS_LOADED:
      return Object.assign({}, state, {
        googleLoaded: action.payload
      })
    default:
      return state
  }
}

export default combineReducers({bookshelf, app})
