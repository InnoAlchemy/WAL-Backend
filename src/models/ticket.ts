import { Schema, model, Document } from "mongoose";

interface Ticket extends Document {
  userId: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  quantity: number;
  couponUsed: string;
  status: string;  // For example, 'active', 'used', etc.
}

const ticketSchema = new Schema<Ticket>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  couponUsed: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    default: "active",
    trim: true,
  },
});

export default model<Ticket>("Ticket", ticketSchema);
