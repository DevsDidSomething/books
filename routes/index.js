var models = require('../models/index')
var express = require('express')
var router  = express.Router()

router.get('/', (req, res) => {
  models.Book
    .findAll()
    .then( books => {
      res.json({status: 'success', message: 'Retrieved all books', data: books});
    })
})


router.post('/mixes/:mix_id/save', (req, res) => {
  var book = req.body.book
  models.Book.create({
    title: book.title,
    author: book.author,
    src: book.src,
    google_id: book.google_id
  }).then( (result) => {
    models.Mix.findOne({where: {id: req.params.mix_id}}).then( (mix) => {
      result.setMixes([mix]).then( () => {
        mix.getBooks()
          .then( (books) => {
            res.json({status: 'success', message: 'Saved book', data: books});
          })
      })
    })
  })
})

router.post('/mixes/:mix_id/remove', (req, res) => {
  models.Book.destroy({
    where: {id: req.body.id}
  }).then( (result) => {
    models.Mix.findOne({where: {id: req.params.mix_id}}).then( (mix) => {
      mix.getBooks()
      .then( (books) => {
        res.json({status: 'success', message: 'Saved book', data: books});
      })
    })
  })
})

router.post('/mixes/remove', (req, res) => {
  models.Mix.destroy({
    where: {id: req.body.id}
  }).then( (result) => {
    models.Mix
      .findAll()
      .then( (mixes) => {
        res.json({status: 'success', message: 'Saved book', data: mixes});
      })
  })
})

router.get('/allmixes', (req, res) => {
  models.Mix
    .findAll()
    .then( mixes => {
      res.json({status: 'success', message: 'Retrieved all books', data: mixes});
    })
})

router.get('/mixes/:mix_id', (req, res) => {
  models.Mix.findOne({where: {id: req.params.mix_id}}).then( (mix) => {
    mix.getBooks()
      .then( books => {
        res.json({status: 'success', message: 'Retrieved all books', data: books});
      })
    })
})

router.post('/mix', (req, res) => {
  var name = req.body.name;
  var webstring = name;
  if (name.length > 50) {
    webstring = name.substring(0,50)
  }
  webstring = webstring.replace(/\s/g, '-')
  webstring = encodeURIComponent(webstring);
  models.Mix.create({
    name: name,
    webstring: webstring
  }).then( (result) => {
    models.Mix
      .findAll()
      .then( (mixes) => {
        res.json({status: 'success', message: 'Saved mix', data: mixes});
      })
  })
})

module.exports = router
