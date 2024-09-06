import { Schema, model, Document } from "mongoose";

interface Coupon extends Document {
  coupon_key: string;
  usage: number;
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
    default: -1, // -1 indicates infinite usage
  },
});

export default model<Coupon>("Coupon", couponSchema);
