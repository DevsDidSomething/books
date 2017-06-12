import path from 'path'
import fs from 'fs'
import Express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import bcrypt from 'bcryptjs'

import routes from './routes/index'
import models from './models/index'


const app = Express()
app.use('/static', Express.static('static'))

app.use(cookieParser())
app.use(bodyParser.json())
app.use(session({ secret: 'alien coffee', resave: true, saveUninitialized: true }))
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
      if (err) return done(null, false, err)
      if (res === false) {
        return done(null, false, { message: 'Incorrect password.' })
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
  models.User.findOne({where: {username: req.body.username }}).then( (user) => {
    if (!user) {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) return res.status(422).send(err)
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) return res.status(422).send('error hashing')
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
              return res.json({status: 'success', message: 'Succesfully created user', data: user});
            })
          })
        })
      })
    } else {
      passport.authenticate('local', (err, user, info) => {
        if (err) { return res.status(422).send(err) }
        if (!user) {
          return res.status(422).send(info.message)
        }
        req.login(user, (err) => {
          if (err) { return res.status(422).send(err) }
          return res.json({status: 'success', message: 'Login successful', data: user});
        })
      })(req, res, next)
    }
  })
})
app.use('/m', routes);

app.get('*', (req, res) => {
  fs.readFile(path.join(__dirname+'/client/public/index.html'), 'utf8', (err, htmlData)=>{
    if (err) {
      console.error('read err', err)
      return res.status(404).end()
    }
    const user = req.isAuthenticated() ? req.user.id : false
    const RenderedApp = htmlData.replace('{{USER}}', JSON.stringify(user))
    res.send(RenderedApp)
  })
});

models.sequelize.sync().then( () => {
  app.listen(3000, () => {
    console.log('App listening on port 3000!')
  });
});
