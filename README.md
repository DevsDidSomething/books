## Use OLD Node

NVM install 6.11.0
NVM use 6.11.0

## Turn off any fancy VS extension like console ninja since that uses ESM imports

They will break the build if you have them. Ignore if not using VS extensions

## Install using yarn

yarn install

## Attempt to run it twice

The server looks for a static folder which only exists after it's failed to run once

## Local postgress connection

Also, you need a local postgres connection
"development": {
"username": null,
"password": null,
"database": "boox",
"host": "127.0.0.1",
"port": "5432",
"dialect": "postgres"
},

$ npm run start:dev

to run an interactive session
$ node console.js

deploy
$ npm run build
$ git push heroku master

https://www.codementor.io/tamizhvendan/beginner-guide-setup-reactjs-environment-npm-babel-6-webpack-du107r9zr
https://medium.com/@justinjung04/react-server-side-rendering-and-hot-reloading-ffb87ca81a89
https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/guides/server-rendering.md

TODO:

- version css
- user settings: allow for private lists?
- search for user
- dedupe search results by isbn. maybe use https://twitter.com/gluejar/status/877214776123957249
- like/follow lists?
