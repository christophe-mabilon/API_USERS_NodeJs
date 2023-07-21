import db from "../models/index.js";

const TV = db.tv

/*
  * fonction qui permet de récupérer tous les documents TV de la base de données.
  * @param {*} req
  * @param {*} res
  * @returns
*/
const getAllTV = async (req, res) => {
  try {
    const tvList = await TV.find().limit(100);
    res.json(tvList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un document TV par son ID
const getTVById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const tv = await TV.findOne({ id: id });
    if (tv) {
      res.json(tv);
    } else {
      res.status(404).json({ message: 'TV not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error + ' ' + req.params.id + ' ' + req.params.id.length);
  }
};

// Créer un nouveau document TV
const createTV = async (req, res) => {
  try {
    const tv = new TV(req.body);
    const newTV = await tv.save();
    res.status(201).json(newTV);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un document TV
const updateTV = async (req, res) => {
  try {
    const tv = await TV.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (tv) {
      res.json(tv);
    } else {
      res.status(404).json({ message: 'TV not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un document TV
const deleteTV = async (req, res) => {
  try {
    const tv = await TV.findByIdAndDelete(req.params.id);
    if (tv) {
      res.json({ message: 'TV deleted' });
    } else {
      res.status(404).json({ message: 'TV not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllTV,
  getTVById,
  createTV,
  updateTV,
  deleteTV,
};
