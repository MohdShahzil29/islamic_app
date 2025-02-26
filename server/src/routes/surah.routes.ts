import { Router } from 'express';
import {
  createSurah,
  getAllSurahs,
  getSurahById,
  updateSurah,
  deleteSurah,
  getSurahByNumber
} from '../controllers/surah.controller';

const router = Router();

// Create a new Surah
router.post('/create', createSurah);

// Get all Surahs
router.get('/', getAllSurahs);

// Get a single Surah by ID
router.get('/:id', getSurahById);

// Get Surah by number
router.get('/number/:number', getSurahByNumber);

// Update a Surah
router.put('/:id', updateSurah);

// Delete a Surah
router.delete('/:id', deleteSurah);

export default router;