const models = require( '../models/index' )
const Express = require( 'express' )
const l = require( '../lib' )
const _ = require( 'lodash' )
const bcrypt = require( 'bcryptjs')

let router  = Express.Router()

function requiresLogin( req, res, next ) {
  if (!req.isAuthenticated()) {
    return res.status(403).send({error: {app: 'You must be logged in'}})
  }
  next()
}

router.post('/:mix_uid/books', requiresLogin)
router.delete('/:mix_uid', requiresLogin)
router.post('/:mix_uid/order', requiresLogin)
router.put('/user/:user_id', requiresLogin)
router.put('/:mix_uid', requiresLogin)
router.post('/mixes', requiresLogin)
router.delete('/:mix_uid/books/:book_id', requiresLogin)

const publicUserAttributes = ['id', 'username']

// Get a full bookshelf (initial load)
//TODO do not show empty mixes
router.get('/allmixes', (req, res) => {
  models.Mix.findAll({where: {isPrivate: false}, include: [ {model: models.User, attributes: ['username']} ]}).then( (mixes) => {
    res.json({status: 'success', message: 'Retrieved all mixes', data: mixes})
  })
})

// Get a full bookshelf (initial load)
router.get('/:username/:mix_uid', (req, res) => {
  const isAllowed = req.isAuthenticated() && (req.user.username === req.params.username || req.user.username === 'kray')
  const scope = isAllowed ? {} : {isPrivate: false}
  models.User.findOne({where: {username: {ilike: req.params.username}}, attributes: publicUserAttributes, include: [ {model: models.Mix, where: scope} ]}).then( (user) => {
    if (_.isEmpty(user)) {
      return res.status(404).send({error: {bookshelf: {fetching: 'Mix not found'}}})
    }
    if ( req.params.mix_uid === 'false' ) {
      scope['UserId'] = user.id
      models.Mix.findAll({where: scope, include: [ models.Book ], order: [[ models.Book, models.BookMix, "order", "ASC" ]]}).then( (mixes) => {
        let bookshelf = {user: user, mixes: mixes}
        res.json({status: 'success', message: 'Retrieved all books', data: bookshelf})
      })
    } else {
      models.Mix.findOne({where: {uid: req.params.mix_uid, UserId: user.id}, include: [ models.Book ], order: [[ models.Book, models.BookMix, "order", "ASC" ]]}).then( (mix) => {
        if (_.isEmpty(mix)) {
          return res.status(404).send({error: {bookshelf: {fetching: 'Mix not found'}}})
        }
        let bookshelf = {user: user, mixes: [mix]}
        res.json({status: 'success', message: 'Retrieved all books', data: bookshelf})
      })
    }
  })
})

// Save a book
router.post('/:mix_uid/books', (req, res) => {
  models.Mix.findOne({where: {uid: req.params.mix_uid}}).then( (mix) => {
    if (mix.UserId !== req.user.id && req.user.username !== 'kray') {
      return res.status(403).send({error: {bookshelf: {edit: 'Not authorized to edit this mix'}}})
    }
    mix.countBooks().then( (mixBooksCount) => {
      let bookData = req.body.book
      models.Book.findOne({where: {google_id: bookData.google_id}}).then( (book) => {
        if (book){
          book.getMixes().then( (bookMixes) => {
            mix.BookMix = {order: mixBooksCount}
            bookMixes.push(mix)
            book.setMixes(_.uniq(bookMixes)).then( () => {
              mix.getBooks().then( (books) => {
                books = _.sortBy(books, (b) => {
                  return b.BookMix.order
                })
                res.json({status: 'success', message: 'Saved book', data: {mixUid: mix.uid, books: books}});
              })
            })
          })
        } else {
          models.Book.create({
            small_image_src: bookData.small_image_src,
            large_image_src: bookData.large_image_src,
            google_id: bookData.google_id,
            title: bookData.title,
            subtitle: bookData.subtitle,
            pageCount: bookData.pageCount,
            publishedDate: bookData.publishedDate,
            categories: bookData.categories,
            author: bookData.author
          }).then( (book) => {
            mix.BookMix = {order: mixBooksCount}
            book.setMixes([mix]).then( () => {
              mix.getBooks().then( (books) => {
                books = _.sortBy(books, (b) => {
                  return b.BookMix.order
                })
                res.json({status: 'success', message: 'Saved book', data: {mixUid: mix.uid, books: books}});
              })
            })
          })
        }
      })
    })
  })
})

// Delete a Book
router.delete('/:mix_uid/books/:book_id', (req, res) => {
  models.Mix.findOne({where: {uid: req.params.mix_uid}}).then( (mix) => {
    if (mix.UserId !== req.user.id && req.user.username !== 'kray') {
      return res.status(403).send({error: {bookshelf: {edit: 'Not authorized to delete books from this mix'}}})
    }
    models.Book.findOne({where: {id: req.params.book_id}, include: [models.Mix]}).then( (book) => {
      book.getMixes().then( (bookMixes) => {
        const bookIndex = _.find(bookMixes, ['id', mix.id]).BookMix.order
        _.remove(bookMixes, {
          id: mix.id
        })
        book.setMixes(bookMixes).then( (result) => {
          mix.getBooks().then( (books) => {
            books.forEach( (b) => {
              if (b.BookMix.order > bookIndex){
                b.BookMix.update({order: b.BookMix.order-1})
              }
            })
            res.json({status: 'success', message: 'Removed book', data: {mixUid: mix.uid, books: books}});
          })
        })
      })
    })
  })
})

// Delete a Mix
router.delete('/:mix_uid', (req, res) => {
  models.Mix.findOne({where: {uid: req.params.mix_uid}}).then( (mix) => {
    if (mix.UserId !== req.user.id && req.user.username !== 'kray') {
      return res.status(403).send({error: {bookshelf: {edit: 'Not authorized to delete this mix'}}})
    }
    mix.destroy().then( () => {
      models.Mix.findAll({where: {UserId: req.user.id}}).then( (mixes) => {
        res.json({status: 'success', message: 'Saved book', data: mixes});
      })
    })
  })
})

// Update MixOrder
router.post('/:mix_uid/order', (req, res) => {
  models.Mix.findOne({where: {uid: req.params.mix_uid}}).then( (mix) => {
    if (mix.UserId !== req.user.id && req.user.username !== 'kray') {
      return res.status(403).send({error: {bookshelf: {edit: 'Not authorized to edit this mix'}}})
    }
    let order = req.body.order
    mix.getBooks().then( (books) => {
      books.forEach( (b) => {
        b.BookMix.update({order: order.indexOf(b.id.toString())})
      })
      books = _.sortBy(books, (b) => {
        return b.BookMix.order
      })
      res.json({status: 'success', message: 'Saved book', data: {mixUid: mix.uid, books: books}});
    })
  })
})

//Update user
router.put('/user/:user_id', (req, res) => {
  if (req.params.user_id !== req.user.id.toString()) {
    return res.status(403).send({error: {user: {general: 'Not authorized to update this user'}}})
  }
  let errors = l.validateFields(req.body, 'update')
  if (!_.isEmpty(errors)) {
    return res.status(422).send({error: {user: errors}})
  }
  models.User.findOne({where: {id: req.user.id }}).then( (user) => {
    models.User.findOne({where: {email: req.body.email, id: {not: user.id} }}).then( (existingEmail) => {
      if (existingEmail){
        return res.status(422).send({error: {user: {email: 'Email is taken'}}})
      }
      if (req.body.password) {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) return res.status(422).send(err)
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) return res.status(422).send('error hashing')
            user.update({
              email: req.body.email,
              password: hash
            }).then( (result) => {
              res.json({status: 'success', message: 'Succesfully saved user', data: l.userData(user)});
            })
          })
        })
      } else {
        user.update({
          email: req.body.email
        }).then( (result) => {
          res.json({status: 'success', message: 'Succesfully saved user', data: l.userData(user)});
        })
      }
    })
  })
})

// Update Mix
router.put('/:mix_uid', (req, res) => {
  models.Mix.findOne({where: {uid: req.params.mix_uid}}).then( (mix) => {
    if (mix.UserId !== req.user.id && req.user.username !== 'kray') {
      return res.status(403).send({error: {mix: {edit: 'Not authorized to delete this mix'}}})
    }
    let attribs = {}
    if (_.has(req.body, 'name')) {
      attribs['name'] = req.body.name
      attribs['webstring'] = l.createWebString(req.body.name)
    }
    if (_.has(req.body, 'isPrivate')) {
      attribs['isPrivate'] = req.body.isPrivate
    }
    mix.update(attribs).then( (result) => {
      models.Mix.findAll({where: {UserId: req.user.id}}).then( (mixes) => {
        res.json({status: 'success', message: 'Saved mix', data: mixes});
      })
    })
  })
})

// Create a new Mix
router.post('/mixes', (req, res) => {
  let name = req.body.name
  let webstring = l.createWebString(name)
  let uid = l.randId()
  models.Mix.create({
    name: name,
    webstring: webstring,
    uid: uid,
    UserId: req.user.id
  }).then( (mix) => {
    // TODO send them to the new mix after this
    models.Mix.findAll({where: {UserId: req.user.id}}).then( (mixes) => {
      res.json({status: 'success', message: 'Saved mix', data: mixes});
    })
  })
})

module.exports = router
