const mongoose = require('mongoose');

// const User = require('./user-model.js');

const Schema = mongoose.Schema;

const movieSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    photoAddress: { type: String },

    // reference the ID of the user
    owner: { type: Schema.Types.ObjectId }

    // user as a subdocument
    // owner: { type: User.schema }
  },
  {
    timestamps: true
  }
);

const Movie = mongoose.model('Movie', movieSchema);


module.exports = Movie;
