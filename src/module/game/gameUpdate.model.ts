import { Schema, model } from 'mongoose';
import { gameCategory } from './game.constant';
import { IPendingGameUpdate } from './game.interface';

const pendingGameUpdateSchema = new Schema<IPendingGameUpdate>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
    gameId: {
      type: String,
      required: [false, 'Game ID is not required'],
      ref: 'Games',
    },
    game_title: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      enum: gameCategory,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: String,
      required: false,
    },
    steam_link: {
      type: String,
      required: false,
    },
    x_link: {
      type: String,
      required: false,
    },
    linkedin_link: {
      type: String,
      required: false,
    },
    reddit_link: {
      type: String,
      required: false,
    },
    instagram_link: {
      type: String,
      required: false,
    },
    media_files: {
      type: [String],
      required: false,
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedBy: {
      type: String,
      ref: 'User',
      required: false,
    },
    reviewedAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

const PendingGameUpdate = model<IPendingGameUpdate>(
  'PendingGameUpdate',
  pendingGameUpdateSchema,
);

export default PendingGameUpdate;