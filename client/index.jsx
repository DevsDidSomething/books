import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import App from './containers/App'
import books from './reducers'
import * as AppActions from './actions'
require('./css/normalize.scss')
require('./css/App.scss')

import airbrakeJs from 'airbrake-js'
let airbrake = new airbrakeJs({projectId: 146652, projectKey: '992e6e0fafe049bac6a53075269386f8'})

let el = document.getElementById('root')
let user = JSON.parse(el.dataset.user)
// Create Redux store with initial state
const store = createStore(
  books,
  {app: {errors: {}, searchResults: [], googleLoaded: false, user: user, allmixes: [], showSaveConfirmation: {}}, bookshelf: {} },
  applyMiddleware(thunk)
)

function loadGoogle() {
  if (google) {
    google.books.load()
    google.books.setOnLoadCallback( () => {
      store.dispatch(AppActions.googleHasLoaded())
    } )
  } else {
    setTimeout(loadGoogle, 100000)
  }
}

loadGoogle()


render(
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/:username?/(mixes)?/:mix_id?/:mix_name?/:action?" component={App}/>
    </BrowserRouter>
  </Provider>,
  el
)
