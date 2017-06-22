const path = require('path')
const fs = require( 'fs')
const Express = require( 'express')
const bodyParser = require( 'body-parser')
const cookieParser = require( 'cookie-parser')
const cookieSession = require( 'cookie-session')
const passport = require( 'passport')
const LocalStrategy = require( 'passport-local')
const bcrypt = require( 'bcryptjs')
const sslRedirect = require('heroku-ssl-redirect')

const routes = require( './routes/index')
const models = require( './models/index')
const l = require( './lib')
const _ = require( 'lodash')

const app = Express()
app.use(sslRedirect())
app.use('/static', Express.static('static'))
app.use(Express.static('client/public'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cookieSession({ secret: 'alien coffee', resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser( (user, done) => {
  done(null, user.id);
})

passport.deserializeUser( (id, done) => {
  models.User.findById(id)
    .then( (user) => {
      if (user) {
        done(null, user.get());
      } else {
        // TODO
        done(err, user)
      }
    })
})

passport.use(new LocalStrategy( (username, password, done) => {
  models.User.findOne({where: {username: username }}).then( (user) => {
    if (!user) {
      return done(null, false, { message: 'no user.' })
    }
    bcrypt.compare(password, user.password, (err, res) => {
      if (err) return done(null, false, { error: {password: err}})
      if (res === false) {
        return done(null, false, { error: {password: 'Incorrect password'} })
      } else {
        return done(null, user)
      }
    })
  })
}))

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
});



app.post('/login',  (req, res, next) => {
  models.User.findOne({where: {username: req.body.username }, attributes: ['id', 'username', 'email']}).then( (user) => {
    if (!user) {
      return res.status(422).send({error: {user: {username: 'No user with that username'}}})
    } else {
      passport.authenticate('local', (err, user, info) => {
        if (err) { return res.status(422).send({error: {user: info.error}}) }
        if (!user) {
          return res.status(422).send({error: {user: info.error}})
        }
        req.login(user, (err) => {
          if (err) { return res.status(422).send(err) }
          return res.json({status: 'success', message: 'Login successful', data: l.userData(user)});
        })
      })(req, res, next)
    }
  })
})

app.post('/signup',  (req, res, next) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return res.status(422).send(err)
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) return res.status(422).send('error hashing')
      let errors = l.validateFields(req.body, 'signup')
      if (!_.isEmpty(errors)) {
        return res.status(422).send({error: {user: errors}})
      }
      models.User.findOne({where: {username: {ilike: req.body.username} }}).then( (existingUsername) => {
        if (existingUsername){
          return res.status(422).send({error: {user: {username: 'Username is taken'}}})
        }
        models.User.findOne({where: {email: req.body.email }}).then( (existingEmail) => {
          if (existingEmail){
            return res.status(422).send({error: {user: {email: 'Email is taken'}}})
          }
          models.User.create({
            username: req.body.username,
            password: hash,
            email: req.body.email
          }).then( (user) => {
            if (!user) {
              return res.status(422).send('no user somehow')
            }
            req.login(user, (err) => {
              if (err) { return res.status(422).send(err) }
              return res.json({status: 'success', message: 'Succesfully created user', data: l.userData(user)});
            })
          })
        })
      })
    })
  })
})

app.use('/m', routes)

app.get('*', (req, res) => {
  fs.readFile(path.join(__dirname+'/client/index.html'), 'utf8', (err, htmlData)=>{
    if (err) {
      console.error('read err', err)
      return res.status(404).end()
    }
    const user = req.isAuthenticated() ? l.userData(req.user) : false
    const RenderedApp = htmlData.replace('{{USER}}', JSON.stringify(user))
    res.send(RenderedApp)
  })
});

models.sequelize.sync().then( () => {
  app.listen((process.env.PORT || 3000), () => {
    console.log('App listening on port 3000!')
  });
});
