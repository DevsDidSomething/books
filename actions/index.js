import fetch from 'isomorphic-fetch'

const PREFIX = "appActions";

export const RECEIVE_USER = `${PREFIX}.RECEIVE_USER`;
function receiveUser(payload) {
  return {
    type: RECEIVE_USER,
    payload
  }
}

export const login = ( userInfo ) => {
  return ( dispatch, getState ) => {
    return fetch(`http://localhost:3000/login`, {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify(userInfo),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then( response => {
      if ( !response.ok ) {
        throw new Error(response.statusText)
      }
      return response
    })
    .then( response => response.json() )
    .then( json => {
      dispatch(receiveUser(json.data))
    })
    .catch ( e => {
      console.log(e)
      //TODO catch error
    })
  }
}

export const IS_FETCHING_BOOKSHELF = `${PREFIX}.IS_FETCHING_BOOKSHELF`;
function isFetchingBookshelf(payload) {
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
    dispatch(isFetchingBookshelf(true))
    return fetch(`http://localhost:3000/m/${username}/${mixUid}`, {
      method: 'GET',
      credentials: 'include'
    })
    .then( response => {
      if ( !response.ok ) {
        throw new Error(response.statusText)
      }
      return response
    })
    .then( response => response.json() )
    .then( json => {
      dispatch(receiveBookshelf(json.data))
      dispatch(isFetchingBookshelf(false))
    })
    .catch ( e => {
      console.log(e)
      //TODO catch error
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

export const searchBook = ( searchTerm ) => {
  return ( dispatch, getState ) => {
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
            src: b.volumeInfo.imageLinks.smallThumbnail,
            google_id: b.id,
            title: b.volumeInfo.title
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
    .then( response => {
      if ( !response.ok ) {
        throw new Error(response.statusText)
      }
      return response
    })
    .then( response => response.json() )
    .then( json => {
      dispatch(receiveBooks(json.data))
      dispatch(getSearchResults([]))
    })
    .catch ( e => {
      console.log(e)
      //TODO catch error
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
    .then( response => {
      if ( !response.ok ) {
        throw new Error(response.statusText)
      }
      return response
    })
    .then( response => response.json() )
    .then( json => {
      dispatch(receiveBooks(json.data))
    })
    .catch ( e => {
      console.log(e)
      //TODO catch error
    })
  }
}

export const deleteMix = ( mixUid ) => {
  return ( dispatch, getState ) => {
    return fetch(`/m/${mixUid}`, {
      credentials: 'include',
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then( response => {
      if ( !response.ok ) {
        throw new Error(response.statusText)
      }
      return response
    })
    .then( response => response.json() )
    .then( json => {
      dispatch(receiveMixes(json.data))
    })
    .catch ( e => {
      console.log(e)
      //TODO catch error
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

export const createMix = ( mixName ) => {
  return ( dispatch, getState ) => {
    return fetch("/m/mixes", {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({name: mixName}),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then( response => {
      if ( !response.ok ) {
        throw new Error(response.statusText)
      }
      return response
    })
    .then( response => response.json() )
    .then( json => {
      dispatch(receiveMixes(json.data))
    })
    .catch ( e => {
      console.log(e)
      //TODO catch error
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
    .then( response => {
      if ( !response.ok ) {
        throw new Error(response.statusText)
      }
      return response
    })
    .then( response => response.json() )
    .then( json => {
      dispatch(receiveMixes(json.data))
    })
    .catch ( e => {
      console.log(e)
      //TODO catch error
    })
  }
}
