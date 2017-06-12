import fetch from 'isomorphic-fetch'

const PREFIX = "appActions";

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

export const getBooks = ( mixID ) => {
  return ( dispatch, getState ) => {
    return fetch(`http://localhost:3000/m/mixes/${mixID}`, {
      method: 'GET'
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

export const getMixes = ( ) => {
  return ( dispatch, getState ) => {
    return fetch(`http://localhost:3000/m/allmixes`, {
      method: 'GET'
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

export const addBook = ( book, mixID ) => {
  return ( dispatch, getState ) => {
    return fetch(`/m/mixes/${mixID}/save`, {
      method: 'POST',
      body: JSON.stringify({book: book, mixID: mixID}),
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

export const deleteBook = ( bookID, mixID ) => {
  return ( dispatch, getState ) => {
    return fetch(`/m/mixes/${mixID}/remove`, {
      method: 'POST',
      body: JSON.stringify({id: bookID}),
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

export const deleteMix = ( mixID ) => {
  return ( dispatch, getState ) => {
    return fetch("/m/mixes/remove", {
      method: 'POST',
      body: JSON.stringify({id: mixID}),
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
    return fetch("/m/mix", {
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

export const updateMix = ( mixID, mixName ) => {
  return ( dispatch, getState ) => {
    return fetch(`/m/mixes/${mixID}`, {
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
