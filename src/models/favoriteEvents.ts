import { Schema, model, Document } from "mongoose";

interface FavoriteEvent extends Document {
  userId: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
}

const favoriteEventSchema = new Schema<FavoriteEvent>({
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
});

export default model<FavoriteEvent>("FavoriteEvent", favoriteEventSchema);
