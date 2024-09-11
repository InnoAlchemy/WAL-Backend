import { Schema, model, Document, Types } from "mongoose";


export interface Reservation extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  quantity:number;
  is_used:boolean;
  check_in:Date;

}

const reservation = new Schema<Reservation>({
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
      is_used:{
        type:Boolean,
        default:false,
      },
      check_in: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
  );

export default model<Reservation>("Reservations", reservation);
