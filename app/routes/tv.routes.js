import express from 'express';
import authJwt from "../middlewares/authJwt.js";
import tvController from '../controllers/tv.controller.js';

const router = express.Router();
// Route GET pour obtenir tous les documents TV
router.get('/', [authJwt.verifyToken, authJwt.isAdmin], tvController.getAllTV);

// Route GET pour obtenir un document TV par son ID
router.get('/:id', tvController.getTVById);

// Route POST pour créer un nouveau document TV
router.post('/', tvController.createTV);

// Route PUT pour mettre à jour un document TV
router.put('/:id', tvController.updateTV);

// Route DELETE pour supprimer un document TV
router.delete('/:id', tvController.deleteTV);

export default router;
