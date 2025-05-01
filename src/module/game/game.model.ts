import mongoose, { Schema } from 'mongoose';
import { CreateGameModel, GameInterface } from './game.interface';
import { gameCategory } from './game.constant';

const GameSchema = new Schema<GameInterface, CreateGameModel>(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    gameId: {
      type: String,
      required: false,
      unique: true,
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
    comments: {
      type: [
        {
          userId: {
            type: String,
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
            type: String,
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

// Middleware
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

// Set gameId before saving
GameSchema.pre('save', function (next) {
  if (!this.gameId) {
    this.gameId = this._id.toString();
  }
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