import models from '../models/index'
import Express from 'express'
import * as l from '../lib'
import _ from 'lodash'

let router  = Express.Router()

function requiresLogin( req, res, next ) {
  if (!req.isAuthenticated()) {
    return res.status(403).send('You must be logged in')
  }
  next()
}

router.post('/:mix_uid/books', requiresLogin)
router.delete('/:mix_uid', requiresLogin)
router.put('/:mix_uid', requiresLogin)
router.post('/mixes', requiresLogin)
router.delete('/:mix_uid/books/:book_id', requiresLogin)

// Get a full bookshelf (initial load)
router.get('/:username/:mix_uid', (req, res) => {
  models.User.findOne({where: {username: req.params.username}, include: [ models.Mix ]}).then( (user) => {
    if ( parseInt(req.params.mix_uid) === 0 ) {
      models.Mix.findOne({where: {UserId: user.id, name: 'all'}, include: [ models.Book ]}).then( (mixAll) => {
        let bookshelf = {user: user, mix: mixAll}
        res.json({status: 'success', message: 'Retrieved all books', data: bookshelf})
      })
    } else {
      models.Mix.findOne({where: {uid: req.params.mix_uid, UserId: user.id}, include: [ models.Book ]}).then( (mix) => {
        let bookshelf = {user: user, mix: mix}
        res.json({status: 'success', message: 'Retrieved all books', data: bookshelf})
      })
    }
  })
})

// Save a book
router.post('/:mix_uid/books', (req, res) => {
  models.Mix.findOne({where: {uid: req.params.mix_uid}}).then( (mix) => {
    if (mix.UserId !== req.user.id) {
      return res.status(403).send('Not authorized to edit this mix')
    }
    let bookData = req.body.book
    models.Book.findOne({where: {google_id: bookData.google_id}}).then( (book) => {
      if (book){
        book.getMixes().then( (bookMixes) => {
          models.Mix.findOne({where: {UserId: req.user.id, name: 'all'}}).then( (mixAll) => {
            bookMixes.push(mix, mixAll)
            book.setMixes(_.uniq(bookMixes)).then( () => {
              mix.getBooks().then( (books) => {
                res.json({status: 'success', message: 'Saved book', data: books});
              })
            })
          })
        })
      } else {
        models.Book.create({
          title: bookData.title,
          author: bookData.author,
          src: bookData.src,
          google_id: bookData.google_id
        }).then( (book) => {
          models.Mix.findOne({where: {UserId: req.user.id, name: 'all'}}).then( (mixAll) => {
            book.setMixes([mix, mixAll]).then( () => {
              mix.getBooks().then( (books) => {
                res.json({status: 'success', message: 'Saved book', data: books});
              })
            })
          })
        })
      }
    })
  })
})

// Delete a Book
router.delete('/:mix_uid/books/:book_id', (req, res) => {
  models.Mix.findOne({where: {uid: req.params.mix_uid}}).then( (mix) => {
    if (mix.UserId !== req.user.id) {
      return res.status(403).send('Not authorized to delete books from this mix')
    }
    models.Book.findOne({where: {id: req.params.book_id}}).then( (book) => {
      book.getMixes().then( (bookMixes) => {
        _.remove(bookMixes, {
          id: mix.id
        })
        // TODO see if it belongs to any of the users other mixes besides all
        // if not, delete it from both this mix and all
        book.setMixes(bookMixes).then( (result) => {
          mix.getBooks().then( (books) => {
            res.json({status: 'success', message: 'Removed book', data: books});
          })
        })
      })
    })
  })
})

// Delete a Mix
router.delete('/:mix_uid', (req, res) => {
  models.Mix.findOne({where: {uid: req.params.mix_uid}}).then( (mix) => {
    if (mix.UserId !== req.user.id) {
      return res.status(403).send('Not authorized to delete this mix')
    }
    if (mix.name === 'all') {
      return res.status(403).send('You cannot delete the default mix')
    }
    mix.destroy().then( () => {
      // TODO send them to 'all' after this
      models.Mix.findAll({where: {UserId: req.user.id}}).then( (mixes) => {
        res.json({status: 'success', message: 'Saved book', data: mixes});
      })
    })
  })
})

// Update Mix
router.put('/:mix_uid', (req, res) => {
  models.Mix.findOne({where: {uid: req.params.mix_uid}}).then( (mix) => {
    if (mix.UserId !== req.user.id) {
      return res.status(403).send('Not authorized to delete this mix')
    }
    let name = req.body.name
    if (name === 'all'){
      return res.status(403).send('You cannot give this mix the default name')
    }
    let webstring = l.createWebString(name)
    mix.update({
      name: name,
      webstring: webstring
    }).then( (result) => {
      models.Mix.findAll({where: {UserId: req.user.id}}).then( (mixes) => {
        res.json({status: 'success', message: 'Saved mix', data: mixes});
      })
    })
  })
})

// Create a new Mix
router.post('/mixes', (req, res) => {
  let name = req.body.name
  if (name === 'all'){
    return res.status(403).send('You cannot give this mix the default name')
  }
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
