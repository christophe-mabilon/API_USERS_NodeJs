import mongoose from "mongoose";

const tvSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  original_name: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
  },
  tagline: {
    type: String,
    required: false,
  },
  in_production: {
    type: Boolean,
  },
  status: {
    type: String,
  },
  original_language: {
    type: String,
  },
  origin_country: {
    type: [String],
  },
  created_by: {
    type: [String],
  },
  first_air_date: {
    type: Date,
  },
  last_air_date: {
    type: Date,
  },
  number_of_episodes: {
    type: Number,
  },
  number_of_seasons: {
    type: Number,
  },
  production_companies: {
    type: [String],
  },
  poster_path: {
    type: String,
  },
  genres: [{
    id: {
      type: Number,
      },
    name: {
      type: String,
      },
  }],
  vote_average: {
    type: Number,
  },
  vote_count: {
    type: Number,
  },
  popularity: {
    type: Number,
  },
}, { collection: 'tv' });

const TV = mongoose.model('TV', tvSchema);

export default TV;
