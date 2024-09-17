import { compare, hash } from "bcrypt";
import { Model, model, Schema, Document, Types } from "mongoose";

// interface (typescript)
export interface UserDocument extends Document {
  userName: string;
  email: string;
  password: string;
  verified: boolean;
  tokens: { token: string }[];
  _id: Types.ObjectId;
  favorites: Types.ObjectId[]; // Add favorites property
  role:string;
  permissions:[string];
}

interface Methods{
    comparePassword(password: string): Promise<boolean>
}

const userSchema = new Schema<UserDocument, {}, Methods>(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      required:true,
      enum: ['admin', 'editor', 'viewer'],  // We need to choose these roles ???
      default: ''  // Default role for new users ????
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  
    favorites: [{ type: Types.ObjectId, ref: "Event" }], // TOO fixx
  },
  // permissions: {
  //   type: [String],  // an array of strings
  //   default: [],     // we should choose the default 
  // },
  { timestamps: true }
);

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
     this.password = await hash(this.password, 10)
    }
     next()
   })
   
   userSchema.methods.comparePassword = async function(password){
     const result = await compare(password, this.password)
     return result
   }


export default model("User", userSchema) as Model<UserDocument, {}, Methods>;
