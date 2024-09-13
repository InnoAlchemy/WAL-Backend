import { Schema, model, Document } from "mongoose";

interface Coupon extends Document {
  coupon_key: string;
  usage: number;
  discount_percentage: number;
}

const couponSchema = new Schema<Coupon>({
  coupon_key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  usage: {
    type: Number,
    required: true,
    default: -1, 
  },
  discount_percentage:{
    type:Number,
    required:true,
  }
}, { timestamps: true });

export default model<Coupon>("Coupon", couponSchema);
