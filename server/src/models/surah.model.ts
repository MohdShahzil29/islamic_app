import mongoose, { Document, Schema } from 'mongoose';

export interface ISurah extends Document {
  number: number;
  nameArabic: string;
  nameUrdu: string;
  nameEnglish: string;
  englishMeaning: string;
  detailsEnglish: string;
  detailsArabi: string,
  detailsUrdu: string;
  totalVerses: number;
  revelationType: string;
  chapterNumber: number;
  juzNumbers: number[];
  sajdahVerses: number[];
  bismillahPre: boolean;
  place: string;
  chronologicalOrder: number;
  rukuCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Surah
const SurahSchema = new Schema<ISurah>({
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  nameArabic: {
    type: String,
    required: true,
  },
  nameUrdu: {
    type: String,
    required: true,
  },
  nameEnglish: {
    type: String,
    required: true,
  },
  englishMeaning: {
    type: String,
    required: true,
  },
  detailsArabi: {
    type: String,
    required: true,
  },
  detailsEnglish: {
    type: String,
    required: true,
  },
  detailsUrdu: {
    type: String,
    required: true,
  },
  totalVerses: {
    type: Number,
    required: true,
  },
  revelationType: {
    type: String,
    enum: ['Meccan', 'Medinan'],
    required: true,
  },
  chapterNumber: {
    type: Number,
    required: true,
  },
  juzNumbers: [{
    type: Number,
    required: true,
  }],
  sajdahVerses: [{
    type: Number,
    default: [],
  }],
  bismillahPre: {
    type: Boolean,
    default: true,
  },
  place: {
    type: String,
    required: true,
  },
  chronologicalOrder: {
    type: Number,
    required: true,
  },
  rukuCount: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,
});

// Create and export the model
const Surah = mongoose.model<ISurah>('Surah', SurahSchema);
export default Surah;