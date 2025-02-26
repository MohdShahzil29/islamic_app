import { Request, Response } from 'express';
import Surah, { ISurah } from '../models/surah.model';

// Create a new Surah
export const createSurah = async (req: Request, res: Response) => {
  try {
    const surah = new Surah(req.body);
    const savedSurah = await surah.save();
    res.status(201).json({
      success: true,
      data: savedSurah,
      message: 'Surah created successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create surah'
    });
  }
};

// Get all Surahs
export const getAllSurahs = async (req: Request, res: Response) => {
  try {
    const surahs = await Surah.find();
    res.status(200).json({
      success: true,
      data: surahs,
      message: 'Surahs retrieved successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve surahs'
    });
  }
};

// Get a single Surah by ID
export const getSurahById = async (req: Request, res: Response) => {
  try {
    const surah = await Surah.findById(req.params.id);
    if (!surah) {
      return res.status(404).json({
        success: false,
        message: 'Surah not found'
      });
    }
    res.status(200).json({
      success: true,
      data: surah,
      message: 'Surah retrieved successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve surah'
    });
  }
};

// Update a Surah
export const updateSurah = async (req: Request, res: Response) => {
  try {
    const surah = await Surah.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!surah) {
      return res.status(404).json({
        success: false,
        message: 'Surah not found'
      });
    }
    res.status(200).json({
      success: true,
      data: surah,
      message: 'Surah updated successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update surah'
    });
  }
};

// Delete a Surah
export const deleteSurah = async (req: Request, res: Response) => {
  try {
    const surah = await Surah.findByIdAndDelete(req.params.id);
    if (!surah) {
      return res.status(404).json({
        success: false,
        message: 'Surah not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Surah deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete surah'
    });
  }
};

// Get Surah by number
export const getSurahByNumber = async (req: Request, res: Response) => {
  try {
    const surah = await Surah.findOne({ number: req.params.number });
    if (!surah) {
      return res.status(404).json({
        success: false,
        message: 'Surah not found'
      });
    }
    res.status(200).json({
      success: true,
      data: surah,
      message: 'Surah retrieved successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve surah'
    });
  }
};
