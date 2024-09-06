import { Schema, model, Document, Types } from "mongoose";

export interface EventDocument extends Document {
  _id: Types.ObjectId; // Ensure this is typed correctly
  title: string;
  description: string;
  date: Date;
  location: string;
  price: number;
  tags: string[];
  pictures: string[];
  type: string;
}

const eventSchema = new Schema<EventDocument>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  pictures: [{
    type: String,
    trim: true,
  }],
  type: {
    type: String,
    required: true,
    trim: true,
  },
});

export default model<EventDocument>("Event", eventSchema);
