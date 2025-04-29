import { Schema, model } from 'mongoose';
import { IPendingUserUpdate } from './user.interface';
import { linksRegex } from '../../constants/regex.constants';

const pendingUserUpdateSchema = new Schema<IPendingUserUpdate>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
    name: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    links: {
      type: [String],
      required: false,
      default: [],
      validate: {
        validator: (links: string[]) =>
          links.every((link) => linksRegex.test(link)),
        message: 'Each link must be a valid URL',
      },
    },
    photo: {
      type: String,
      required: false,
      default: null,
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

const PendingUserUpdate = model<IPendingUserUpdate>(
  'PendingUserUpdate',
  pendingUserUpdateSchema,
);

export default PendingUserUpdate;
