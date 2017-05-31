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
        const results = json.items.filter(function(b){
          return b.volumeInfo.imageLinks
        }).map( function ( b ) {
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

export const addBook = ( book ) => {
  return ( dispatch, getState ) => {
    return fetch("/books/save", {
      method: 'POST',
      body: JSON.stringify(book),
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

export const deleteBook = ( bookID ) => {
  return ( dispatch, getState ) => {
    return fetch("/books/remove", {
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
