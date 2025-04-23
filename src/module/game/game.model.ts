import mongoose, { Schema } from 'mongoose';
import { CreateGameModel, GameInterface } from './game.interface';
import { gameCategory } from './game.constant';

// Schema definition
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
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// middlewere
GameSchema.pre('find', function (next) {
  this.find({ isDelete: { $ne: true } });
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
  'games',
  GameSchema,
);

export default games;
