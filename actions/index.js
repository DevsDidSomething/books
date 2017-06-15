import fetch from 'isomorphic-fetch'

const PREFIX = "appActions";

export const RECEIVE_USER = `${PREFIX}.RECEIVE_USER`;
function receiveUser(payload) {
  return {
    type: RECEIVE_USER,
    payload
  }
}

export const RECEIVE_ERROR = `${PREFIX}.RECEIVE_ERROR`;
function receiveError(payload) {
  return {
    type: RECEIVE_ERROR,
    payload
  }
}

export const login = ( userInfo, mode, fromHomepage ) => {
  return ( dispatch, getState ) => {
    return fetch(`/${mode}`, {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify(userInfo),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then( response => response.json() )
    .then( json => {
      if (json.error){
        dispatch(receiveError(json.error))
      } else {
        dispatch(receiveUser(json.data))
        if (fromHomepage) {
          dispatch(pushToPath(`/${json.data.username}`))
        }
      }
    })
  }
}

export const IS_FETCHING_BOOKSHELF = `${PREFIX}.IS_FETCHING_BOOKSHELF`;
function setFetchingBookshelf(payload) {
  return {
    type: IS_FETCHING_BOOKSHELF,
    payload
  }
}

export const RECEIVE_BOOKSHELF = `${PREFIX}.RECEIVE_BOOKSHELF`;
function receiveBookshelf(payload) {
  return {
    type: RECEIVE_BOOKSHELF,
    payload
  }
}

export const getBookshelf = (username, mixUid) => {
  return ( dispatch, getState ) => {
    dispatch(setFetchingBookshelf(true))
    return fetch(`/m/${username}/${mixUid}`, {
      method: 'GET',
      credentials: 'include'
    })
    .then( response => response.json() )
    .then( json => {
      if (json.error){
        dispatch(receiveError(json.error))
      } else {
        dispatch(receiveBookshelf(json.data))
        dispatch(setFetchingBookshelf(false))
      }
    })
  }
}

export const RECEIVE_ALL_MIXES = `${PREFIX}.RECEIVE_ALL_MIXES`;
function receiveAllMixes(payload) {
  return {
    type: RECEIVE_ALL_MIXES,
    payload
  }
}

export const getAllMixes = () => {
  return ( dispatch, getState ) => {
    return fetch(`/m/allmixes`, {
      method: 'GET',
      credentials: 'include'
    })
    .then( response => response.json() )
    .then( json => {
      if (json.error){
        dispatch(receiveError(json.error))
      } else {
        dispatch(receiveAllMixes(json.data))
      }
    })
  }
}

export const GET_SEARCH_RESULTS = `${PREFIX}.GET_SEARCH_RESULTS`;
function getSearchResults(payload) {
  return {
    type: GET_SEARCH_RESULTS,
    payload
  }
}

export const IS_SEARCHING = `${PREFIX}.IS_SEARCHING`;
function setSearching(payload) {
  return {
    type: IS_SEARCHING,
    payload
  }
}

export const searchBook = ( searchTerm ) => {
  return ( dispatch, getState ) => {
    dispatch(setSearching(true))
    return fetch( `https://www.googleapis.com/books/v1/volumes?printType=books&q=${searchTerm}`, {} )
      .then( response => {
        if ( !response.ok ) {
          throw new Error(response.statusText)
        }
        return response
      })
      .then( response => response.json() )
      .then( json => {
        const results = json.items.filter( (b) => {
          return b.volumeInfo.imageLinks
        }).map( ( b ) => {
          return {
            small_image_src: b.volumeInfo.imageLinks.smallThumbnail,
            large_image_src: b.volumeInfo.imageLinks.thumbnail,
            google_id: b.id,
            title: b.volumeInfo.title,
            subtitle: b.volumeInfo.subtitle,
            pageCount: b.volumeInfo.pageCount,
            publishedDate: b.volumeInfo.publishedDate,
            categories: b.volumeInfo.categories ? b.volumeInfo.categories.join(', ') : '',
            author: b.volumeInfo.authors ? b.volumeInfo.authors.join(', ') : 'No author'
          }
        })
        dispatch(getSearchResults(results))
      })
      .catch ( e => {
        console.log(e)
        //TODO catch error
      })
  }
}

export const RECEIVE_BOOKS = `${PREFIX}.RECEIVE_BOOKS`;
function receiveBooks(payload) {
  return {
    type: RECEIVE_BOOKS,
    payload
  }
}

export const addBook = ( book, mixUid ) => {
  return ( dispatch, getState ) => {
    return fetch(`/m/${mixUid}/books`, {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({book: book}),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then( response => response.json() )
    .then( json => {
      if (json.error){
        dispatch(receiveError(json.error))
      } else {
        dispatch(receiveBooks(json.data))
        dispatch(getSearchResults([]))
      }
    })
  }
}

export const deleteBook = ( bookID, mixUid ) => {
  return ( dispatch, getState ) => {
    return fetch(`/m/${mixUid}/books/${bookID}`, {
      credentials: 'include',
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then( response => response.json() )
    .then( json => {
      if (json.error){
        dispatch(receiveError(json.error))
      } else {
        dispatch(receiveBooks(json.data))
      }
    })
  }
}

export const deleteMix = ( mixUid ) => {
  return ( dispatch, getState ) => {
    const currentUsername = getState().app.user.username
    return fetch(`/m/${mixUid}`, {
      credentials: 'include',
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then( response => response.json() )
    .then( json => {
      if (json.error){
        dispatch(receiveError(json.error))
      } else {
        dispatch(receiveMixes(json.data))
        dispatch(pushToPath(`/${currentUsername}`))
      }
    })
  }
}

export const RECEIVE_MIXES = `${PREFIX}.RECEIVE_MIXES`;
function receiveMixes(payload) {
  return {
    type: RECEIVE_MIXES,
    payload
  }
}

export const GOOGLE_HAS_LOADED = `${PREFIX}.GOOGLE_HAS_LOADED`;
export const googleHasLoaded = () => {
  return {
    type: GOOGLE_HAS_LOADED,
    payload: true
  }
}

export const PUSH_TO_PATH = `${PREFIX}.PUSH_TO_PATH`;
export const pushToPath = (path) => {
  return {
    type: PUSH_TO_PATH,
    payload: path
  }
}

export const createMix = ( mixName ) => {
  return ( dispatch, getState ) => {
    const currentUsername = getState().app.user.username
    return fetch("/m/mixes", {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({name: mixName}),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then( response => response.json() )
    .then( json => {
      if (json.error){
        dispatch(receiveError(json.error))
      } else {
        dispatch(receiveMixes(json.data))
        const newMix = _.find(json.data, ['name', mixName])
        const path = `/${currentUsername}/mixes/${newMix.uid}/${newMix.webstring}`
        dispatch(pushToPath(path))
      }
    })
  }
}

export const updateMixOrder = ( mixUid, bookOrder ) => {
  return ( dispatch, getState ) => {
    return fetch(`/m/${mixUid}/order`, {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({order: bookOrder}),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then( response => response.json() )
    .then( json => {
      if (json.error){
        dispatch(receiveError(json.error))
      } else {
        dispatch(receiveBooks(json.data))
      }
    })
  }
}

export const updateMix = ( mixUid, mixName ) => {
  return ( dispatch, getState ) => {
    return fetch(`/m/${mixUid}`, {
      credentials: 'include',
      method: 'PUT',
      body: JSON.stringify({name: mixName}),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then( response => response.json() )
    .then( json => {
      if (json.error){
        dispatch(receiveError(json.error))
      } else {
        dispatch(receiveMixes(json.data))
      }
    })
  }
}
