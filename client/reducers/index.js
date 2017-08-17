import { combineReducers } from 'redux'
import * as AppActions from "../actions/index"
const _ = require( 'lodash' )

const bookshelf = (state = {}, action) => {
  switch (action.type) {
    case AppActions.RECEIVE_BOOKSHELF:
      return action.payload
    case AppActions.RECEIVE_BOOKS:
      const mixIndex = _.findIndex(state.mixes, ['uid', action.payload.mixUid])
      const mix = Object.assign({}, state.mixes[mixIndex], {Books: action.payload.books})
      state.mixes.splice(mixIndex, 1, mix)
      return Object.assign({}, state, {
        mixes: state.mixes
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
    case AppActions.RECEIVE_ERROR:
      return Object.assign({}, state, {
        errors: {
          ...state.errors,
          ...action.payload
        }
      })
    case AppActions.SAVE_CONFIRMATION:
      return Object.assign({}, state, {
        showSaveConfirmation: action.payload
      })
    case AppActions.RECEIVE_ALL_MIXES:
      return Object.assign({}, state, {
        allMixes: action.payload
      })
    case AppActions.IS_FETCHING_BOOKSHELF:
      return Object.assign({}, state, {
        isFetchingBookshelf: action.payload
      })
    case AppActions.IS_SEARCHING:
      return Object.assign({}, state, {
        isSearching: action.payload
      })
    case AppActions.PUSH_TO_PATH:
      return Object.assign({}, state, {
        pushedPath: action.payload
      })
    case AppActions.GET_SEARCH_RESULTS:
      return Object.assign({}, state, {
        searchResults: action.payload,
        isSearching: false
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
