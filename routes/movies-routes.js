const express = require('express');
const ensure = require('connect-ensure-login');
const multer = require('multer');
const path = require('path');

const Movie = require('../models/movies-model.js');


const router = express.Router();


router.get('/movies/new',
  // We need to be logged in to review movies
  ensure.ensureLoggedIn('/login'),

  (req, res, next) => {
    res.render('movies/new-movie-view.ejs');
  }
);


const myUploader = multer({
  dest: path.join(__dirname, '../public/uploads')
});

// <form method="post" action="/movies">
router.post('/movies',
  // We need to be logged in to review movies
  ensure.ensureLoggedIn('/login'),

  // <input type="file" name="moviePhoto">
  //                              |
  //                     ----------
  //                     |
  myUploader.single('moviePhoto'),

  (req, res, next) => {
    // req.file is your file object no matter what the input name is
    console.log('');
    console.log('req.file ~~~~~~~~~~~~~~~~~~~~~~');
    console.log(req.file);
    console.log('');

    const theMovie = new Movie({
      name: req.body.movieName,
      description: req.body.movieDescription,
      photoAddress: `/uploads/${req.file.filename}`,
      owner: req.user._id
    });

    theMovie.save((err) => {
      if (err) {
        next(err);
        return;
      }

      req.flash('success', 'Your review was saved successfully.');

      res.redirect('/movies');
    });
  }
);


router.get('/movies',
  ensure.ensureLoggedIn(),

  (req, res, next) => {
    Movie.find(
      { owner: req.user._id },

      (err, moviesList) => {
        if (err) {
          next(err);
          return;
        }

        res.render('movies/movies-list-view.ejs', {
          movies: moviesList,
          successMessage: req.flash('success')
        });
      }
    );
  }
);


module.exports = router;
