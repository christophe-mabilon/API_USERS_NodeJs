import db from "../models/index.js";
import { responseTvErrors } from "../middlewares/errorHandler.js";

const TV = db.tv;

const getAllTV = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const tvList = await TV.find().skip(startIndex).limit(limit);
    
    // Get the total count of TV shows
    const totalTVCount = await TV.countDocuments();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalTVCount / limit);

    // Create a pagination object to include in the response
    const pagination = {
      totalItems: totalTVCount,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    };

    // Check if there are more pages
    if (endIndex < totalTVCount) {
      pagination.nextPage = page + 1;
    }

    // Check if there are previous pages
    if (startIndex > 0) {
      pagination.previousPage = page - 1;
    }

    res.json({ tvList, pagination });
  } catch (err) {
    return responseTvErrors(err, res);
  }
};

// Obtenir un document TV par son ID
const getTVById = async (req, res) => {
  try {
    const id = req.params.id;
    const tv = await TV.findById(id);
    if (tv) {
      res.json(tv);
    }
  } catch (err) {
    return responseTvErrors(err, res);
  }
};

// Créer un nouveau document TV
const createTV = async (req, res) => {
  try {
    const tv = new TV(req.body);
    await tv.save();
    res.status(201).json({ message: "Série TV sauvegardée avec succes !" });
  } catch (err) {
    return responseTvErrors(err, res);
  }
};

const updateTV = async (req, res) => {
  try {
    const tvId = req.params.id;
    const tv = await TV.findById(tvId);

    if (!tv) {
      return responseTvErrors(404, res);
    }
    const {
      id,
      name,
      original_name,
      overview,
      tagline,
      in_production,
      status,
      original_language,
      origin_country,
      created_by,
      first_air_date,
      last_air_date,
      number_of_episodes,
      number_of_seasons,
      production_companies,
      poster_path,
      vote_average,
      vote_count,
      popularity,
    } = req.body;

    // Mettre à jour les champs du document TV
    if (id) tv.id = id;
    if (name) tv.name = name;
    if (original_name) tv.original_name = original_name;
    if (overview) tv.overview = overview;
    if (tagline) tv.tagline = tagline;
    if (in_production) tv.in_production = in_production;
    if (status) tv.status = status;
    if (original_language) tv.original_language = original_language;
    if (origin_country) tv.origin_country = origin_country;
    if (created_by) tv.created_by = created_by;
    if (first_air_date) tv.first_air_date = first_air_date;
    if (last_air_date) tv.last_air_date = last_air_date;
    if (number_of_episodes) tv.number_of_episodes = number_of_episodes;
    if (number_of_seasons) tv.number_of_seasons = number_of_seasons;
    if (production_companies) tv.production_companies = production_companies;
    if (poster_path) tv.poster_path = poster_path;
    if (vote_average) tv.vote_average = vote_average;
    if (vote_count) tv.vote_count = vote_count;
    if (popularity) tv.popularity = popularity;

    // Sauvegarder les modifications
    await tv.save();
    res.json({ message: "Série TV mis a jour avec succes" });
  } catch (err) {
    return responseTvErrors(err, res);
  }
};

// Supprimer un document TV
const deleteTV = async (req, res) => {
  try {
    const tvId = req.params.id;
    const tv = await TV.findById(tvId);
    if (tv) {
      tv.deleteOne();
      res.json({ message: "Série TV supprimé avec succes !" });
    } else {
      return responseTvErrors(404, res);
    }
  } catch (err) {
    return responseTvErrors(err, res);
  }
};

export default {
  getAllTV,
  getTVById,
  createTV,
  updateTV,
  deleteTV,
};
