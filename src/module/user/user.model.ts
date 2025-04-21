import { Model, Schema, Types, model } from 'mongoose';
import { TUserSignUp } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../app/config';

const TUserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'name is Required'],
    },
    email: {
      type: String,
      required: [false, 'Email is Not Required'],
    },
    password: {
      type: String,
      required: [true, 'password is Required'],
    },
  },
  {
    timestamps: true,
  },
);

TUserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

// mongoose middlewere 
TUserSchema.pre('save',async function(next){

  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user=this;
  user.password=await bcrypt.hash(user.password as string,Number(config.bcrypt_salt_rounds as string));

  next();


});
//post save middleware hook
TUserSchema.post('save',function(doc,next){
  doc.password='';
  // after the save the password is empy becouse of security issues
  next();
});




const User: Model<TUserSignUp> = model<TUserSignUp>('User', TUserSchema);
export default User;
