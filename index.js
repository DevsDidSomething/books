import path from 'path'
import Express from 'express'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import bodyParser from 'body-parser'
import http from 'http'

import bookReducer from './reducers'
import App from './containers/App'
import routes from './routes/index'
import models from './models/index'


const app = Express()

app.use(bodyParser.json());

app.use('/static', Express.static('static'));

app.use('/books', routes);

app.use(handleRender)

function handleRender(req, res) {
  models.Book.findAll().then( books => {
    models.Mix.findAll().then( mixes => {
      const store = createStore(bookReducer, {searchResults: [], books: books, mixes: mixes})

      const html = renderToString(
        <Provider store={store}>
          <App />
        </Provider>
      )

      const preloadedState = store.getState()
      res.send(renderFullPage(html, preloadedState ))
    })
  })

}

function renderFullPage(html, preloadedState) {
  return `<!doctype html>
    <html>
      <head>
        <title>Bookshelf</title>
        <link rel='stylesheet' href='/static/bundle.css'>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `
}

models.sequelize.sync().then(function() {
  http.createServer(app).listen(3000, function(){
    console.log('App listening on port 3000!')
  });
});
