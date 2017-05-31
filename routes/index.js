var models = require('../models/index')
var express = require('express')
var router  = express.Router()

router.get('/', function(req, res){
  models.Book
    .findAll()
    .then( books => {
      res.json({status: 'success', message: 'Retrieved all books', data: books});
    })
})


router.post('/save', (req, res) => {
  var book = req.body
  models.Book.create({
    title: book.title,
    author: book.author,
    src: book.src,
    google_id: book.google_id
  }).then( (result) => {
    models.Book
      .findAll()
      .then(function(books){
        res.json({status: 'success', message: 'Saved book', data: books});
      })
  })
})

router.post('/remove', (req, res) => {
  models.Book.destroy({
    where: {id: req.body.id}
  }).then( (result) => {
    models.Book
      .findAll()
      .then(function(books){
        res.json({status: 'success', message: 'Saved book', data: books});
      })
  })
})

module.exports = router
