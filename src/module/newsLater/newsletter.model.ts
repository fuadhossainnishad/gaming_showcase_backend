import { Model, model, Schema } from 'mongoose';
import { INewsletter } from './newsletter.interface';

const NewsletterSchema = new Schema<INewsletter>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true },
);

const NewsLetter: Model<INewsletter> = model<INewsletter>(
  'NewsLetter',
  NewsletterSchema,
);

export default NewsLetter;
