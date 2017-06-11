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
  //TODO shouldn't use name here
  var mixName = req.body.mixName
  var book = req.body.book
  models.Book.create({
    title: book.title,
    author: book.author,
    src: book.src,
    google_id: book.google_id
  }).then( (result) => {
    console.log('this is the result')
    console.log(result)
    models.Mix.findOne({where: {name: mixName}}).then( (mix) => {
      console.log(mix)
      result.setMixes([mix])
      models.Book
        .findAll()
        .then(function(books){
          res.json({status: 'success', message: 'Saved book', data: books});
        })
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

router.post('/mixes/remove', (req, res) => {
  models.Mix.destroy({
    where: {id: req.body.id}
  }).then( (result) => {
    models.Mix
      .findAll()
      .then(function(mixes){
        res.json({status: 'success', message: 'Saved book', data: mixes});
      })
  })
})

router.post('/mix', (req, res) => {
  var name = req.body.name;
  var webstring = name;
  if (name.length > 30) {
    webstring = name.substring(0,27)
  }
  webstring = encodeURIComponent(webstring);
  models.Mix.create({
    name: name,
    webstring: webstring
  }).then( (result) => {
    models.Mix
      .findAll()
      .then(function(mixes){
        res.json({status: 'success', message: 'Saved mix', data: mixes});
      })
  })
})

module.exports = router
