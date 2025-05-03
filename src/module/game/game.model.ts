import mongoose, { Schema } from 'mongoose';
import { CommentsInterface, CreateGameModel, GameInterface, ShareInterface } from './game.interface';
import { gameCategory } from './game.constant';

const GameSchema = new Schema<GameInterface, CreateGameModel>(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: [String],
      required: true,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    categories: {
      type: [String],
      required: true,
    },
    platform: {
      type: [String],
      required: false,
    },
    price: {
      type: Number,
      required: true,
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

GameSchema.set('toJSON', {
  virtuals: true, versionKey: false, transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    ret.userId = ret.userId.toString()
    ret.comments = ret.comments.map((comment: CommentsInterface) => ({
      ...comment,
      userId: comment.userId.toString(),
    }))
    ret.shares = ret.shares.map((share: ShareInterface) => ({
      ...share,
      userId: share.userId.toString(),
    }))
    return ret
  }
})

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

GameSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = this._id.toString();
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