import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import App from '../containers/App'
import books from '../reducers'
import * as AppActions from '../actions'
require('../css/App.scss')

let el = document.getElementById('root')
let user = JSON.parse(el.dataset.user)
// Create Redux store with initial state
const store = createStore(books, {searchResults: [], books: [], mixes: [], googleLoaded: false, user: user}, applyMiddleware(thunk))

// Load google books
google.books.load()
google.books.setOnLoadCallback( () => {
  store.dispatch(AppActions.googleHasLoaded())
} )

render(
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/mixes/:mix_id/:filter" component={App}/>
    </BrowserRouter>
  </Provider>,
  el
)
