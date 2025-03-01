import { Request, Response } from 'express';
import Surah, { ISurah } from '../models/surah.model';
import redisClient from '../config/redis';

// Create a new Surah
export const createSurah = async (req: Request, res: Response) => {
  try {
    const surah = new Surah(req.body);
    const savedSurah = await surah.save();
    await redisClient.del('allSurahs'); // Clear cache after creation
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
    const cachedSurahs = await redisClient.get('allSurahs');
    if (cachedSurahs) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cachedSurahs),
        message: 'Surahs retrieved successfully (from cache)'
      });
    }
    const surahs = await Surah.find();
    await redisClient.setEx('allSurahs', 3600, JSON.stringify(surahs)); // Cache for 1 hour
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
    const cacheKey = `surah:${req.params.id}`;
    const cachedSurah = await redisClient.get(cacheKey);
    if (cachedSurah) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cachedSurah),
        message: 'Surah retrieved successfully (from cache)'
      });
    }
    const surah = await Surah.findById(req.params.id);
    if (!surah) {
      return res.status(404).json({
        success: false,
        message: 'Surah not found'
      });
    }
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(surah)); // Cache for 1 hour
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
    await redisClient.del('allSurahs'); // Clear cache after update
    await redisClient.del(`surah:${req.params.id}`);
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
    await redisClient.del('allSurahs'); // Clear cache after deletion
    await redisClient.del(`surah:${req.params.id}`);
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
    const cacheKey = `surah:number:${req.params.number}`;
    const cachedSurah = await redisClient.get(cacheKey);
    if (cachedSurah) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cachedSurah),
        message: 'Surah retrieved successfully (from cache)'
      });
    }
    const surah = await Surah.findOne({ number: req.params.number });
    if (!surah) {
      return res.status(404).json({
        success: false,
        message: 'Surah not found'
      });
    }
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(surah)); // Cache for 1 hour
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

// Search Surahs
export const searchSurahs = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }

    // Redis cache key
    const cacheKey = `search:${query}`;

    // Check cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit for query:", query);
      return res.json({ success: true, surahs: JSON.parse(cachedData) });
    }

    // Search in multiple name fields
    const surahs = await Surah.find({
      $or: [
        { nameArabic: new RegExp(query.toString(), "i") },
        { nameUrdu: new RegExp(query.toString(), "i") },
        { nameEnglish: new RegExp(query.toString(), "i") }
      ]
    });

    console.log("Surah", surahs)

    // Cache the result
    await redisClient.setEx(cacheKey, 60, JSON.stringify(surahs));
    // console.log("Cache miss for query:", query, "- caching result");

    return res.json({ success: true, surahs });
  } catch (error) {
    console.error("Error searching surahs:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};