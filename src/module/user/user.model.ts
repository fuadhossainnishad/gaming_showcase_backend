import { Model, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../app/config';
import { USER_ROLE } from './user.constant';
import { IUser, IUserModel } from './user.interface';

const linksRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/;

const userSchema = new Schema<IUser, IUserModel>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
    },
    name: {
      type: String,
      required: [false, 'name is Required'],
    },
    email: {
      type: String,
      required: [false, 'Email is Not Required'],
    },
    password: {
      type: String,
      required: [false, 'password is Required'],
      select: false,
    },
    role: {
      type: String,
      enum: [USER_ROLE.ADMIN, USER_ROLE.USER],
      default: USER_ROLE.USER,
    },
    bio: {
      type: String,
      required: [false, 'Bio is not require'],
    },
    links: {
      type: [String],
      required: [false, 'Links are not required'],
      default: [],
      validate: {
        validator: (links: string[]) =>
          links.every((link) => linksRegex.test(link)),
        message: 'Each link must be a valid URL',
      },
    },
    photo: {
      type: String,
      required: [false, 'photo is not require'],
      default: null,
    },
    uploadedGame: {
      type: [String],
      required: [false, 'photo is not require'],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Middleware and methods stay the same
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds as string),
  );
  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

userSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Static methods implementation
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

userSchema.statics.isJWTIssuesBeforePasswordChange = async function (
  passwordChangeTimestamp: Date,
  jwtIssuesTime: number,
): Promise<boolean> {
  const passwordChangeTime = new Date(passwordChangeTimestamp).getTime() / 1000;
  return passwordChangeTime > jwtIssuesTime;
};

// Create and export the model with correct typing
const User = model<IUser, IUserModel>('User', userSchema);
export default User;
