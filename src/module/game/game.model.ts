import { Model, Schema, Types, model } from 'mongoose';
import { gameInterface } from './game.interface';

const GameSchema: Schema = new Schema(
  {
    game_title: {
      type: String,
      required: [true, 'Game title is Required'],
    },
    category: {
      type: String,
      required: [false, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is Required'],
    },
    steam_link: {
      type: String,
      required: [true, 'address is Required'],
    },
    x_link: {
      type: String,
      required: [true, 'address is Required'],
    },
    linkedin_link: {
      type: String,
      required: [true, 'address is Required'],
    },
    reddit_link: {
      type: String,
      required: [true, 'address is Required'],
    },
    instagram_link: {
      type: String,
      required: [true, 'address is Required'],
    },
  },
  {
    timestamps: true,
  },
);

// // midlewere
// TContractSchema.pre('find', function (next) {
//   this.find({ isDelete: { $ne: true } });
//   next();
// });
// TContractSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
//   next();
// });
// TContractSchema.pre('findOne', function (next) {
//   this.find({ isDelete: { $ne: true } });
//   next();
// });

export const Game: Model<gameInterface> = model<gameInterface>(
  'Game',
  GameSchema,
);
