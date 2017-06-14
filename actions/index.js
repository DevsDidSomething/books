import fetch from 'isomorphic-fetch'

const PREFIX = "appActions";

export const RECEIVE_USER = `${PREFIX}.RECEIVE_USER`;
function receiveUser(payload) {
  return {
    type: RECEIVE_USER,
    payload
  }
}

export const login = ( userInfo, fromHomepage ) => {
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
      if (fromHomepage) {
        dispatch(pushToPath(`/${json.data.username}`))
      }
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
    const currentUsername = getState().app.user.username
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
      dispatch(pushToPath(`/${currentUsername}`))
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
    .then( response => {
      if ( !response.ok ) {
        throw new Error(response.statusText)
      }
      return response
    })
    .then( response => response.json() )
    .then( json => {
      dispatch(receiveMixes(json.data))
      const newMix = _.find(json.data, ['name', mixName])
      const path = `/${currentUsername}/mixes/${newMix.uid}/${newMix.webstring}`
      dispatch(pushToPath(path))
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
