import mongoose, { Schema } from 'mongoose';
import { CreateGameModel, GameInterface } from './game.interface';
import { gameCategory } from './game.constant';
import { boolean, number } from 'zod';

const GameSchema = new Schema<GameInterface, CreateGameModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    game_title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: gameCategory,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    steam_link: {
      type: String,
      required: true,
    },
    x_link: {
      type: String,
      required: true,
    },
    linkedin_link: {
      type: String,
      required: true,
    },
    reddit_link: {
      type: String,
      required: true,
    },
    instagram_link: {
      type: String,
      required: true,
    },
    media_files: {
      type: [String],
      required: true,
    },
    comments: {
      type: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    totalComments: {
      type: Number,
      default: 0,
    },
    shares: {
      type: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
        },
      ],
      default: [],
    },
    totalShare: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// middleware
GameSchema.pre('find', function (next) {
  this.where({ isDelete: { $ne: true } });
  next();
});
GameSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});
GameSchema.pre('findOne', function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});

GameSchema.statics.isExistGame = async function (
  id: string,
): Promise<GameInterface> {
  const game = await this.findById(id);
  if (!game) {
    throw new Error('Game not found');
  }
  return game;
};

const games = mongoose.model<GameInterface, CreateGameModel>(
  'Games',
  GameSchema,
);

export default games;
