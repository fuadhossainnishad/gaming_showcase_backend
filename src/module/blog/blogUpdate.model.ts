import { Schema, model } from 'mongoose';
import { gameCategory } from './blog.constant';
import { IPendingGameUpdate } from './blog.interface';

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
    title: {
      type: String,
      required: false,
    },
    subTitle: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    image: {
      type: [String],
      required: false,
      default: [],
    },
    thumbnail: {
      type: String,
      required: false,
    },
    categories: {
      type: [String],
      required: false,
    },
    platform: {
      type: [String],
      required: false,
    },
    price: {
      type: String,
      required: false,
    },
    socialLinks: {
      type: [
        {
          name: { type: String, required: true },
          link: { type: String, required: true },
        },
      ],
      required: false,
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