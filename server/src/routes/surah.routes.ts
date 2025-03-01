import { Router } from 'express';
import express from 'express';
import path from 'path';
import {
  createSurah,
  getAllSurahs,
  getSurahById,
  updateSurah,
  deleteSurah,
  getSurahByNumber
} from '../controllers/surah.controller';

const router = express.Router();

// Create a new Surah
router.post('/create', createSurah);

// Get all Surahs
router.get('/get-all', getAllSurahs);

// Get a single Surah by ID
router.get('/getbyId/:id', getSurahById);

// Get Surah by number
router.get('/number/:number', getSurahByNumber);

// Update a Surah
router.put('/:id', updateSurah);

// Delete a Surah
router.delete('/:id', deleteSurah);



export default router;